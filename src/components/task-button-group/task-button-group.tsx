import { Component, Host, h, Prop } from '@stencil/core';
import classNames from 'classnames';

@Component({
  tag: 'task-button-group',
  styleUrl: 'task-button-group.css',
  scoped: false,
})
export class TaskButtonGroup {
  @Prop() alignText: string = "center"
  @Prop() fill: boolean = false
  @Prop() large: boolean = false
  @Prop() minimal: boolean = false
  @Prop() vertical: boolean = false

  render() {
    return (
      <Host class={classNames("button-group")}>
        <slot></slot>
      </Host>
    );
  }

}
