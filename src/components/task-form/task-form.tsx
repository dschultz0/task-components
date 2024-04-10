import { Component, Host, h, Element, Prop, Listen } from '@stencil/core';
import { Context } from '../../utils/context'
import { debounce } from '../../utils/utils';


@Component({
  tag: 'task-form',
  styleUrl: 'task-form.css',
  shadow: false,
})
export class TaskForm {
  @Prop() saveLocal: boolean = false
  @Prop() localId: string
  @Element() host
  formElement: HTMLFormElement
  context: Context
  sendFormState = debounce(() => sendFormState(this.formElement))

  componentDidLoad() {
    // TODO: do something when we don't have a form...
    // TODO: Remove the event listener when unloaded
    if (this.formElement) {
      this.formElement.addEventListener("submit", e => this.onSubmit(e))
      this.formElement.focus()
    }

    this.context = new Context()
    window.parent.postMessage({type: 'requestTaskContext'}, window.origin)
    window.addEventListener('appload', () => {
      // TODO: Update this to find the correct input to focus on
      const input = document.querySelector("input")
      if (input) {
        input.focus()
      }
    })
  }

  @Listen("inputUpdated", {target: "document"})
  onInputUpdated() {
    console.log('inputUpdated')
    this.sendFormState()
  }

  @Listen("message", {target: "window"})
  onMessage(event: MessageEvent) {
    if (event.data.type === 'taskContext') {
      console.log("received taskContext")
      this.context.updateFromContextMessage(event.data)
      if (event.data.response) {
        console.log("updating form from response")
        console.log(event.data.response)
        if (this.formElement) {
          for (const [key, value] of Object.entries(event.data.response)) {
            const element = this.formElement.elements[key]
            element.value = value
          }
        }
      }
    }
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    const formResponse = buildFormResponse(this.formElement)
    if (this.context.mode === "requester-preview") {
      // TODO: Display preview response
      console.log("Submitted in preview:")
      console.log(formResponse)
    } else if (this.context.mode === "working" && this.context.site === "open-event") {
      const eventType = this.context.submitEventType || "submitTask"
      console.log("sending form data to parent")
      window.parent.postMessage({
        type: eventType,
        formResponse: formResponse,
      }, window.origin);
    }
  }

  render() {
    return (
      <Host>
        <form ref={el => this.formElement = el as HTMLFormElement}>
          <slot></slot>
        </form>
      </Host>
    );
  }

}

function buildFormResponse(form: HTMLFormElement) {
  const formData = new FormData(form)
  const response = {}
  for (let pair of formData.entries()) {
    response[pair[0]] = pair[1]
  }
  return response
}

function sendFormState(form: HTMLFormElement) {
  const formResponse = buildFormResponse(form)
  window.parent.postMessage({
    type: "formUpdated",
    formResponse: formResponse,
  }, window.origin)
}
