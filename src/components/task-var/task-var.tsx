import { Component, Host, h, Prop, Element } from '@stencil/core';

@Component({
  tag: 'task-var',
  styleUrl: 'task-var.css',
  scoped: true,
})
export class TaskVar {
  @Prop() name: string
  @Element() host: HTMLElement
  value: string

  componentWillLoad() {
    let element: HTMLElement = this.host
    while (element.parentElement && !this.value) {
      element = element.parentElement
      if (this.name in element.dataset) {
        this.value = element.dataset[this.name]
      }
    }
  }

  render() {
    return (
      <Host>
        {this.value}
        <slot></slot>
      </Host>
    );
  }

}
