import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'task-label',
  styleUrl: 'task-label.css',
  scoped: true,
})
export class TaskLabel {

  render() {
    return (
      <Host>
        <label>
          <slot></slot>
        </label>
      </Host>
    );
  }

}
