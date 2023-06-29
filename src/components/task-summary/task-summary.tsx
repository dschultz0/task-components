import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'task-summary',
  styleUrl: 'task-summary.css',
  scoped: true,
})
export class TaskSummary {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
