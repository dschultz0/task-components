import { Component, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Element } from '@stencil/core';
import { getFormElement, inputsWithAnswers, InputUpdatedEvent, requiredChildInputs } from '../../utils/inputBase';
import { ignoreKeypress, KeyboardShortcut } from '../../utils/utils';

@Component({
  tag: 'task-submit',
  styleUrl: 'task-submit.css',
  scoped: true,
})
export class TaskSubmit {
  @Prop() keyboardShortcut: string
  @Prop({mutable: true}) disabled: boolean = false
  @Prop() disableUntilComplete: boolean = true
  @Event() registerKeyboardShortcut: EventEmitter<KeyboardShortcut>
  @Event() showCorrections: EventEmitter
  @Event() taskSubmit: EventEmitter
  @State() correctionMode: boolean = false
  @State() readyToSubmit: boolean = false
  @Element() host: HTMLElement
  button!: HTMLButtonElement

  componentWillLoad() {
    if (this.keyboardShortcut) {
      this.registerKeyboardShortcut.emit(
        {label: "Submit", keys: this.keyboardShortcut}
      )
    }
  }

  // TODO: Add listener triggered from tc body and/or new form
  @Listen("all-crowd-elements-ready", {target: "document"})
  taskReady() {
    this.refreshSubmitReady()
  }

  @Listen("keydown", { target: "document" })
  keypressHandler(event: KeyboardEvent) {
    if (!ignoreKeypress() && event.key === this.keyboardShortcut && !this.disabled) {
      this.button.click()
    }
  }

  @Listen("tc:input", {target: "body"})
  inputUpdatedHandler(event: CustomEvent<InputUpdatedEvent>) {
    this.refreshSubmitReady(event.detail.form)
  }k

  @Method()
  async refreshSubmitReady(form?: HTMLFormElement) {
    if (!form) {
      form = getFormElement(this.host)
    }
    if (form && this.disableUntilComplete) {
      Promise.all(requiredChildInputs(form).map(i => i.readyToSubmit()))
        .then(values => {
          this.disabled = !values.every(Boolean)
        })
    }
  }

  handleValidationResult(values: boolean[]) {
    if (values.every(Boolean)) {
      this.readyToSubmit = true
      this.button.click()
    } else {
      this.showCorrections.emit()
      this.correctionMode = true
    }
  }

  handleSubmit(event: Event) {
    const inputs = inputsWithAnswers()
    if (inputs && !this.readyToSubmit && !this.correctionMode) {
      event.preventDefault()
      Promise.all(inputs.map(input => input.validateAgainstAnswer()))
        .then(values => this.handleValidationResult(values))
    } else {
      this.taskSubmit.emit()
    }
  }

  @Method()
  async setShowCorrections(value: boolean) {
    this.correctionMode = value
  }

  render() {
    // Note that the button tag must be a single row to prevent crowd-form adding another one
    return (
      <Host>
        <button type="submit"
                ref={el => this.button = el as HTMLButtonElement}
                disabled={this.disabled}
                onClick={this.handleSubmit.bind(this)}>Submit</button>
        <div class={this.correctionMode ? "" : "message-hidden"}>
          <slot></slot>
        </div>
      </Host>
    );
  }

}
