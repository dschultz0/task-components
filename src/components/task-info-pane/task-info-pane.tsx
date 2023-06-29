import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'task-info-pane',
  styleUrl: 'task-info-pane.css',
  scoped: true,
})
export class TaskInfoPane {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
