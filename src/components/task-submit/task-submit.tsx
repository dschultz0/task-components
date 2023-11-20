import { Component, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Element } from '@stencil/core';
import { getFormElement, inputsWithAnswers, requiredChildInputs } from '../../utils/inputBase';
import { CallbackFunction, ignoreKeypress, KeyboardShortcut } from '../../utils/utils';

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
  form!: HTMLFormElement
  formUpdatedCallback: CallbackFunction
  loadCallback: CallbackFunction

  componentWillLoad() {
    // TODO: This probably needs to be rerun if the mode changes for some reason
    this.refreshSubmitReady()
    if (this.keyboardShortcut) {
      this.registerKeyboardShortcut.emit(
        {label: "Submit", keys: this.keyboardShortcut}
      )
    }
  }

  connectedCallback() {
    if (['interactive', 'complete'].includes(document.readyState)) {
      this.setupFormListener()
    } else {
      this.loadCallback = this.setupFormListener.bind(this)
      document.addEventListener("load", this.loadCallback)
    }
  }

  setupFormListener() {
    this.form = getFormElement(this.host)
    if (this.form) {
      this.formUpdatedCallback = this.refreshSubmitReady.bind(this)
      this.form.addEventListener("input", this.formUpdatedCallback)
      this.refreshSubmitReady()
    } else {
      setTimeout(this.setupFormListener, 1000)
    }
  }

  disconnectedCallback() {
    if (this.formUpdatedCallback) {
      this.form.removeEventListener("input", this.formUpdatedCallback)
    }
    if (this.loadCallback) {
      document.removeEventListener("load", this.loadCallback)
    }
  }

  @Listen("keydown", { target: "document" })
  keypressHandler(event: KeyboardEvent) {
    if (!ignoreKeypress() && event.key === this.keyboardShortcut && !this.disabled) {
      this.button.click()
    }
  }

  @Method()
  async refreshSubmitReady() {
    if (this.form && this.disableUntilComplete) {
      Promise.all(requiredChildInputs(this.form).map(i => i.readyToSubmit()))
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
