import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'task-info-pane',
  styleUrl: 'task-info-pane.css',
  scoped: true,
})
export class TaskInfoPane {
  @Prop() width: string

  hostStyle() {
    if (this.width) {
      return {flex: `0 0 ${this.width}px`}
    } else {
      return {}
    }
  }

  render() {
    return (
      <Host style={this.hostStyle()}>
        <slot></slot>
      </Host>
    );
  }

}
