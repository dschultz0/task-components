import { Component, Host, h, Element } from '@stencil/core';

@Component({
  tag: 'task-copyable',
  styleUrl: 'task-copyable.css',
  scoped: false,
})
export class TaskCopyable {
  @Element() host: HTMLElement

  handleClick() {
    navigator.clipboard.writeText(this.host.innerText).then()
  }

  render() {
    return (
      <Host>
        <slot></slot>
        <task-button
          icon="duplicate"
          minimal={true}
          small={true}
          icon-size={12}
          onClick={() => this.handleClick()}
        ></task-button>
      </Host>
    );
  }

}
