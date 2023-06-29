import { Component, Host, h, Prop, Element, Watch, Event, EventEmitter, Listen } from '@stencil/core';
import { childInputs } from '../../utils/utils';

@Component({
  tag: 'task-answer',
  styleUrl: 'task-answer.css',
  scoped: true,
})
export class TaskAnswer {
  @Prop() value: string
  // Accepts values of 'true', 'false' and 'correction'. If 'true' and a task-answer child is present,
  // the value will be displayed by default. If 'correction', the answer will be displayed after an attempt
  // to submit.
  @Prop() showAnswer: string = "correction"
  @Prop() preventChanges: boolean
  @Prop() displayCorrection: boolean = false
  @Prop() onDisplayEvent: string
  @Event() display: EventEmitter<boolean>
  @Element() host: HTMLElement

  componentWillLoad() {
    const inputs = childInputs(this.host)
    for (let input of inputs) {
      input.disabled = true
    }
  }

  @Watch("displayCorrection")
  handleDisplayUpdate() {
    const inputs = childInputs(this.host)
    for (let input of inputs) {
      input.disabled = !this.displayCorrection
    }
    this.display.emit(this.displayCorrection)
  }

  @Listen("display")
  handleDisplay() {
    if (this.onDisplayEvent) {
      eval(this.onDisplayEvent)
    }
  }

  render() {
    return (
      <Host class={this.displayCorrection ? "" : "correction-hidden"}>
        <slot></slot>
      </Host>
    );
  }

}
