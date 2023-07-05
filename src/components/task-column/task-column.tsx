import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'task-column',
  styleUrl: 'task-column.css',
  scoped: true,
})
export class TaskColumn {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
