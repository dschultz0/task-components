import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'task-row',
  styleUrl: 'task-row.css',
  scoped: true,
})
export class TaskRow {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
