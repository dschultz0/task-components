import { Component, Host, h, Prop, Event, EventEmitter, Listen, Element, Method } from '@stencil/core';
import { requiredChildInputs } from '../../utils/inputBase';

@Component({
  tag: 'task-card',
  styleUrl: 'task-card.css',
  scoped: true,
})
export class TaskCard {
  @Prop() label: string
  @Prop() width: string;
  @Prop({mutable: true}) collapsed: boolean;
  @Prop() collapsable: boolean;
  @Element() host;
  @Event() cardClicked: EventEmitter<TaskCard>;
  @Event() cardReadyToSubmit: EventEmitter<boolean>;

  @Listen("click", { capture: true })
  clickHandler(e) {
    console.log(e.target)
    this.cardClicked.emit(this.host)
    this.host.focus()
  }

  @Listen("tc:input")
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
      return {width: `${this.width}`}
    } else {
      return {}
    }
  }

  handleOpenToggle() {
    this.collapsed = !this.collapsed
    if (!this.collapsed) {
      this.cardClicked.emit(this.host)
    }
  }

  render() {
    return (
      <Host style={this.hostStyle()} tabindex={0}>
        {this.label && this.collapsable && <h3 onClick={this.handleOpenToggle.bind(this)}><task-icon icon={this.collapsed ? "caret-right" : "caret-down"}/>{this.label}</h3>}
        <div class={this.collapsed && "content-hidden"}><slot></slot></div>
      </Host>
    );
  }
}
