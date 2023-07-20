import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'task-button',
  styleUrl: 'task-button.css',
  scoped: true,
})
export class TaskButton {
  @Prop() href: string
  @Prop() intent: string = "primary"
  @Prop() disabled: boolean

  render() {
    return (
      <Host>
        <a href={this.href} class={"button intent-" + this.intent + (this.disabled ? " disabled" : "")} target="_blank"><slot></slot></a>
      </Host>
    );
  }

}
