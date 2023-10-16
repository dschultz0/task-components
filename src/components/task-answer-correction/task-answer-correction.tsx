import { Component, Host, h, Watch, Listen, Prop, Event, EventEmitter, Element } from '@stencil/core';
import { childInputs } from '../../utils/inputBase';

@Component({
  tag: 'task-answer-correction',
  styleUrl: 'task-answer-correction.css',
  scoped: true,
})
export class TaskAnswerCorrection {
  // Can be either 'submit' or 'mismatch'
  @Prop() displayOn: string = "submit"
  @Prop() showAnswer: boolean = false
  @Prop() preventChanges: boolean = false
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
  handleDisplay(event: CustomEvent<boolean>) {
    // TODO: This all could be refactored or abandoned
    if (this.onDisplayEvent) {
      let command = this.onDisplayEvent
      if (command.includes("${visible}")) {
        command = command.replace("${visible}", event.detail.toString())
      }
      eval(command)
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
