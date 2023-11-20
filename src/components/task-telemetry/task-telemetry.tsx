import { Component, Host, h, Prop, State, Method, Element, Listen } from '@stencil/core';
import { getMarks, mark } from '../../utils/utils';

type FetchFunction = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
type Mark = {
  name: string
  time: number
}

@Component({
  tag: 'task-telemetry',
  styleUrl: 'task-telemetry.css',
  scoped: true,
})
export class TaskTelemetry {
  @Prop() name: string = "telemetry"
  @Prop() submitEndpoint: string
  @Prop() heartbeatEndpoint: string
  @Prop() heartbeatInterval: number = 30
  @State() value: object
  @Element() host: HTMLElement
  fetchMethod: FetchFunction
  internalHeartbeat: number
  heartbeat: number
  attributes: object

  connectedCallback() {
    mark("start")
    this.internalHeartbeat = window.setInterval(() => {
      this.persistData()
    }, 5000)
    this.heartbeat = window.setInterval(() => {
      this.sendHeartbeat()
    }, this.heartbeatInterval * 1000)
  }

  @Listen('focus', {target: 'window'})
  @Listen('blur', {target: 'window'})
  @Listen('all-crowd-elements-ready', {target: 'document'})
  @Listen('keypress', {target: 'document'})
  @Listen('click', {target: 'document'})
  markEventHandler(event: Event) {
    // TODO: Find a way to address duplicate clicks being fired on radio input clicks
    mark(event.type)
  }

  // This allows us to toggle to an alternate fetch method when provided
  fetcher(input: RequestInfo | URL, init?: RequestInit) {
    if (this.fetchMethod) {
      return this.fetchMethod(input, init)
    } else {
      return fetch(input, init)
    }
  }

  sendHeartbeat() {
    // console.log("send heartbeat")
    if (this.heartbeatEndpoint) {
      return this.fetcher(this.heartbeatEndpoint, {
        method: "POST",
        body: JSON.stringify({
          attributes: this.attributes,
          timestamp: new Date(Date.now()).toISOString()
        }),
        headers: {
          "Accept": "application/json",
          "Content-type": "application/json"
        }
      })
    }
  }

  @Listen('submit', {target: 'document', capture: true})
  handleSubmit() {
    this.persistData()

    // console.log("send telemetry")
    if (this.submitEndpoint) {
      return this.fetcher(this.submitEndpoint, {
        method: "POST",
        body: JSON.stringify(this.value),
        headers: {
          "Accept": "application/json",
          "Content-type": "application/json"
        }
      })
    }
  }

  persistData() {
    // Get the list of marks
    let marks: Mark[] = getMarks()
      .map(mark => { return {"name": mark.name.split(":")[1], time: Math.round(mark.startTime)}})
    marks = deduplicateMarks(marks)
    // console.log(marks)

    // compute time spent
    let time = {
      task: 0,
      blur: 0
    }
    let lastBlurTime = 0
    let isBlurred = false
    const now = Math.round(window.performance.now())
    for (let m of marks) {
      switch (m.name) {
        case "start":
          time.task = now - m.time
          lastBlurTime = m.time
          break
        case "focus":
          time.blur += (m.time - lastBlurTime)
          isBlurred = false
          break
        case "blur":
          lastBlurTime = m.time
          isBlurred = true
          break
      }
    }
    if (isBlurred) {
      time.blur += (now - lastBlurTime)
    }
    time["focus"] = time.task - time.blur
    // console.log(time)

    // count relevant marks
    const excludedMarks = ["start", "all-crowd-elements-ready"]
    const cMarks = marks.filter(m => !excludedMarks.includes(m.name))
    const markCounts = cMarks.reduce((counts, {name}) => {
      if (name in counts) {
        counts[name]++
      } else {
        counts[name] = 1
      }
      return counts;
    }, {})
    // console.log(counts)

    const data = {
      time,
      markCounts,
    }
    localStorage.setItem("telemetryData", JSON.stringify(data))
    this.value = {
      time,
      markCounts,
      attributes: this.attributes
    }
  }

  @Method()
  async setFetchMethod(func: Function) {
    this.fetchMethod = func as FetchFunction
  }

  disconnectedCallback() {
    window.clearInterval(this.internalHeartbeat)
    window.clearInterval(this.heartbeat)
  }

  componentDidLoad() {
    const childAttributes = this.host.querySelectorAll("task-telemetry-attribute")
    this.attributes = {}
    for (let child of childAttributes.values()) {
      this.attributes[child.getAttribute("name")] = child.getAttribute("value")
    }
    // Delay sending the first heartbeat in case another script is setting the fetchMethod
    setTimeout(this.sendHeartbeat.bind(this), 2000)
  }

  render() {
    return (
      <Host>
        <input type="hidden" name="taskTelemetry" value={JSON.stringify(this.value)}/>
        <slot></slot>
      </Host>
    )
  }
}

function deduplicateMarks(marks: Mark[]): Mark[] {
  // We assume that the marks are already sorted by time
  const newMarks: Mark[] = []
  let lastMark: Mark
  for (let m of marks) {
    if (!lastMark || Math.round(lastMark.time/10) !== Math.round(m.time/10) || lastMark.name !== m.name) {
      newMarks.push(m)
      lastMark = m
    }
  }
  return newMarks
}
