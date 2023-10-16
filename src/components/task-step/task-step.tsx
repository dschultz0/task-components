import { Component, Host, h, Prop, State, Watch, Listen, Method, Element, Event, EventEmitter } from '@stencil/core';
import { childInputs, requiredChildInputs } from '../../utils/inputBase';

@Component({
  tag: 'task-step',
  styleUrl: 'task-step.css',
  scoped: true,
})
export class TaskStep {
  @Prop() label: string
  @Prop() active: boolean
  @State() open: boolean = false
  @Element() host;
  @Event() cardReadyToSubmit: EventEmitter<boolean>;
  @Event() cardClicked: EventEmitter<TaskStep>;

  componentWillLoad() {
    this.open = this.active
  }

  handleOpenToggle() {
    this.open = !this.open
    if (this.open) {
      this.cardClicked.emit(this.host)
    }
  }

  @Watch("active")
  activeUpdated(newValue) {
    this.open = newValue
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

  render() {
    return (
      <Host class={this.active ? "active" : ""}>
        <h3 onClick={this.handleOpenToggle.bind(this)}><task-icon icon={this.open ? "caret-down" : "caret-right"}/>{this.label}</h3>
        <div class={!this.open && "content-hidden"}><slot></slot></div>
      </Host>
    );
  }

}
