import { Component, Host, h, Prop, Event, EventEmitter, Listen, Element, Watch, Method } from '@stencil/core';
import { childInputs, requiredChildInputs } from '../../utils/inputBase';

@Component({
  tag: 'task-card',
  styleUrl: 'task-card.css',
  scoped: true,
})
export class TaskCard {
  @Prop() active: boolean;
  @Prop() width: number;
  @Element() host;
  @Event() cardClicked: EventEmitter<TaskCard>;
  @Event() cardReadyToSubmit: EventEmitter<boolean>;
  // TODO: Props for width and other configurable values

  @Listen("click", { capture: true })
  clickHandler() {
    this.cardClicked.emit(this.host)
  }

  @Watch("active")
  handleActiveUpdate(newValue: boolean) {
    for (let input of childInputs(this.host)) {
      input.active = newValue
    }
  }

  @Listen("inputUpdated")
  handleInputUpdated() {
    this.readyToSubmit().then(ready => {
      this.cardReadyToSubmit.emit(ready)
    })
  }

  @Method()
  async readyToSubmit() {
    return Promise.all(requiredChildInputs(this.host).map(i => i.readyToSubmit()))
      .then(values => {
        return values.every(Boolean)
      })
  }

  hostStyle() {
    if (this.width) {
      return {width: `${this.width}px`}
    } else {
      return {}
    }
  }

  render() {
    return (
      <Host class={this.active ? "active" : ""} style={this.hostStyle()}>
        <slot></slot>
      </Host>
    );
  }
}
