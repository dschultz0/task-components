import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'task-callout',
  styleUrl: 'task-callout.css',
  scoped: true,
})
export class TaskCallout {
  @Prop() intent: string

  render() {
    return (
      <Host class={this.intent ? "intent-" + this.intent : null}>
        <slot></slot>
      </Host>
    );
  }
}
