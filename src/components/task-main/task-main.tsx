import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'task-main',
  styleUrl: 'task-main.css',
  scoped: true,
})
export class TaskMain {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
