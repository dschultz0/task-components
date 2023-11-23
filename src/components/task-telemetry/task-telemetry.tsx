import { Component, Host, h, Prop, State, Method, Element, Listen } from '@stencil/core';
import { getMarks, mark } from '../../utils/utils';

type FetchFunction = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
type Mark = {
  name: string
  time: number
}
type TelemetryValue = {
  timeMs: object,
  markCounts: object,
  attributes: object,
  startTimestamp: string
}
type StoredTelemetry = {
  timeMs: object,
  markCounts: object,
  priorData?: StoredTelemetry
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
  @Prop() heartbeatInterval: number = 10
  @Prop() localStorageId: string
  @State() value: TelemetryValue
  @Element() host: HTMLElement
  fetchMethod: FetchFunction
  attributes: object = {}
  recordingActive: boolean = true
  idle: boolean = false
  internalHeartbeat: number
  heartbeat: number
  priorData: StoredTelemetry
  lastHeartbeatTime: object = {}
  startTimestamp: string

  /*
   When connected to the DOM two heartbeats are active. The internal heartbeat triggers updating the telemetry
   value and optionally writing it to localStorage. The second can send a heartbeat message to the specified
   endpoint.
   */
  connectedCallback() {
    this.internalHeartbeat = window.setInterval(() => {
      this.persistData()
    }, 2000)
    this.heartbeat = window.setInterval(() => {
      this.sendHeartbeat()
    }, this.heartbeatInterval * 1000)
  }
  disconnectedCallback() {
    window.clearInterval(this.internalHeartbeat)
    window.clearInterval(this.heartbeat)
  }

  /*
   Default listeners for expected mark events
   */
  @Listen('focus', {target: 'window'})
  @Listen('blur', {target: 'window'})
  markFocusEventHandler(event: Event) {
    this.idle = event.type !== 'focus'
    this.markEventHandler(event)
  }
  @Listen('all-crowd-elements-ready', {target: 'document'})
  @Listen('keypress', {target: 'document'})
  @Listen('click', {target: 'document'})
  markEventHandler(event: Event) {
    // TODO: Find a way to address duplicate clicks being fired on radio input clicks
    mark(event.type)
  }

  /*
   This allows us to toggle to an alternate fetch method when provided
   */
  fetcher(input: RequestInfo | URL, init?: RequestInit) {
    if (this.fetchMethod) {
      return this.fetchMethod(input, init)
    } else {
      return fetch(input, init)
    }
  }

  sendHeartbeat() {
    if (this.heartbeatEndpoint && this.recordingActive) {
      this.persistData()
      const timeDelta = subtractMeasures(this.value.timeMs, this.lastHeartbeatTime)
      this.lastHeartbeatTime = this.value.timeMs
      return this.fetcher(this.heartbeatEndpoint, {
        method: "POST",
        body: JSON.stringify({
          attributes: this.attributes,
          timestamp: new Date(Date.now()).toISOString(),
          idle: this.idle,
          timeMs: timeDelta
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
    this.persistData(true)
    const active = this.recordingActive
    this.recordingActive = false

    // console.log("send telemetry")
    if (this.submitEndpoint && active) {
      return this.fetcher(this.submitEndpoint, {
        method: "POST",
        body: JSON.stringify(this.value),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      })
    }
  }

  persistData(clearStorage = false) {
    if (this.recordingActive) {
      // Get the list of marks
      let marks: Mark[] = getMarks()
        .map(mark => {
          return { "name": mark.name.split(":")[1], time: Math.round(mark.startTime) }
        })
      marks = deduplicateMarks(marks)
      // console.log(marks)

      // compute time spent
      let timeMs = {
        task: 0,
        blur: 0,
        load: 0
      }
      let lastBlurTime = 0
      let isBlurred = false
      const now = Math.round(window.performance.now())
      for (let m of marks) {
        switch (m.name) {
          case "start":
            timeMs.task = now - m.time
            lastBlurTime = m.time
            timeMs.load = m.time
            break
          case "focus":
            timeMs.blur += (m.time - lastBlurTime)
            isBlurred = false
            break
          case "blur":
            lastBlurTime = m.time
            isBlurred = true
            break
        }
      }
      if (isBlurred) {
        timeMs.blur += (now - lastBlurTime)
      }
      timeMs["focus"] = timeMs.task - timeMs.blur
      // console.log(time)

      // count relevant marks
      const excludedMarks = ["start", "all-crowd-elements-ready"]
      const cMarks = marks.filter(m => !excludedMarks.includes(m.name))
      const markCounts = cMarks.reduce((counts, { name }) => {
        if (name in counts) {
          counts[name]++
        } else {
          counts[name] = 1
        }
        return counts;
      }, {})
      // console.log(counts)

      /*
      There are two storage locations here with different purposes.
      1. The localStorage is used to capture the current state of the time
      measures and mark counts so that they can be persisted in the event
      of a restart or SMGT release/resume.
      2. The `value` state (also stored in the input element) contains the sum
      time and marks for the current session plus any priorData.

      To support multiple restarts, any priorData is also persisted in local
      storage.
       */
      if (this.localStorageId) {
        if (clearStorage) {
          localStorage.removeItem(this.localStorageId)
        } else {
          const data = {
            timeMs,
            markCounts,
            priorData: this.priorData
          }
          localStorage.setItem(this.localStorageId, JSON.stringify(data))
        }
      }
      this.value = {
        timeMs: this.priorData ? sumMeasures(timeMs, this.priorData.timeMs, {recentTask: timeMs.task}) : timeMs,
        markCounts: this.priorData ? sumMeasures(markCounts, this.priorData.markCounts) : markCounts,
        attributes: this.attributes,
        startTimestamp: this.startTimestamp
      }
    }
  }

  @Method()
  async setFetchMethod(func: Function) {
    this.fetchMethod = func as FetchFunction
  }

  componentWillLoad() {
    // Grab "priorTime" and "priorMarkCounts" from any stored values with this key
    if (this.localStorageId) {
      const priorDataString = localStorage.getItem(this.localStorageId)
      if (priorDataString) {
        this.priorData = JSON.parse(priorDataString)
        // flatten if multiple restarts
        if (this.priorData.priorData) {
          this.priorData = {
            timeMs: sumMeasures(this.priorData.timeMs, this.priorData.priorData.timeMs),
            markCounts: sumMeasures(this.priorData.markCounts, this.priorData.priorData.markCounts)
          }
        }
      }
    }
  }

  componentDidLoad() {
    mark("start")
    this.startTimestamp = new Date(Date.now()).toISOString()
    const childAttributes = Array.from(this.host.querySelectorAll("task-telemetry-attribute").values())
    for (let child of childAttributes) {
      this.attributes[child.getAttribute("name")] = child.getAttribute("value")
    }
    this.attributes["userAgent"] = window.navigator.userAgent
    // Delay sending the first heartbeat in case another script is setting the fetchMethod
    setTimeout(this.sendHeartbeat.bind(this), 2000)
  }

  render() {
    return (
      <Host>
        <input type="hidden" name={this.name} value={JSON.stringify(this.value)}/>
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

function sumMeasures(...objs: object[]) {
  return objs.reduce((a, b) => {
    for (let k in b) {
      if (b.hasOwnProperty(k))
        a[k] = (a[k] || 0) + b[k];
    }
    return a;
  }, {});
}

function subtractMeasures(a: object, b: object) {
  const delta = {...a}
  for (let k in b) {
    if (delta.hasOwnProperty(k)) {
      delta[k] = delta[k] - b[k]
    }
  }
  return delta
}
