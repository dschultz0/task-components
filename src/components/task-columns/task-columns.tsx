import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'task-columns',
  styleUrl: 'task-columns.css',
  scoped: true,
})
export class TaskColumns {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
