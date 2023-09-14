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
        <div class="header"><slot name="header"></slot></div>
        <div class="main"><slot></slot></div>
      </Host>
    );
  }

}
