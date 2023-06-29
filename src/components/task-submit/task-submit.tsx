import { Component, Event, EventEmitter, h, Host, Listen, Method, Prop, State } from '@stencil/core';
import { TaskCard } from '../task-card/task-card';
import { ignoreKeypress, inputsWithAnswers, KeyboardShortcut } from '../../utils/utils';

@Component({
  tag: 'task-submit',
  styleUrl: 'task-submit.css',
  scoped: true,
})
export class TaskSubmit {
  @Prop() keyboardShortcut: string
  @Prop({mutable: true}) disabled: boolean = false
  @Prop() disableUntilCompleteMode: string
  @Event() registerKeyboardShortcut: EventEmitter<KeyboardShortcut>
  @State() displayMessage: boolean = false
  @State() readyToSubmit: boolean = false
  button!: HTMLButtonElement

  componentWillLoad() {
    // TODO: This probably needs to be rerun if the mode changes for some reason
    if (this.disableUntilCompleteMode === "card") {
      this.refreshSubmitReady()
    }
    if (this.keyboardShortcut) {
      this.registerKeyboardShortcut.emit(
        {label: "Submit", keys: this.keyboardShortcut}
      )
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
    if (this.disableUntilCompleteMode === "card") {
      const cards = document.querySelectorAll("TASK-CARD")
      Promise.all(Array.from(cards).map(card => ((card as unknown) as TaskCard).readyToSubmit()))
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
      this.displayMessage = true
    }
  }

  handleSubmit(event: Event) {
    const inputs = inputsWithAnswers()
    if (inputs && !this.readyToSubmit && !this.displayMessage) {
      event.preventDefault()
      Promise.all(inputs.map(input => input.validateAgainstAnswer()))
        .then(values => this.handleValidationResult(values))
    }
  }

  render() {
    // Note that the button tag must be a single row to prevent crowd-form adding another one
    return (
      <Host>
        <button type="submit"
                ref={el => this.button = el as HTMLButtonElement}
                disabled={this.disabled}
                onClick={this.handleSubmit.bind(this)}>Submit</button>
        <div class={this.displayMessage ? "" : "message-hidden"}>
          <slot></slot>
        </div>
      </Host>
    );
  }

}
