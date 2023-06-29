import { Component, Host, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'task-tag',
  styleUrl: 'task-tag.css',
  scoped: true,
})
export class TaskTag {
  @Prop() round: boolean
  @Prop() color: string
  @Prop() removable: boolean
  @Prop() large: boolean
  @Prop() small: boolean
  @Prop() minimal: boolean
  @Prop() interactive: boolean
  @Prop() onremove = () => {}
  @State() removed: boolean

  classes() {
    const classList = []
    if (this.round) {
      classList.push("round")
    }
    if (this.color) {
      classList.push("color-" + this.color)
    }
    if (this.large) {
      classList.push("large")
    }
    if (this.small) {
      classList.push("small")
    }
    if (this.minimal) {
      classList.push("minimal")
    }
    if (this.interactive) {
      classList.push("interactive")
    }
    return classList.join(" ")
  }

  render() {
    return (
      <Host class={this.classes()}>
        <slot></slot>
      </Host>
    );
  }

}
