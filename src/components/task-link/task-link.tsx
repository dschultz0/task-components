import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'task-link',
  styleUrl: 'task-link.css',
  scoped: true,
})
export class TaskLink {
  @Prop() href: string;
  @Prop() type: string = "link";
  @Prop() customStyle: string;

  render() {
    // TODO: Validate how the style is passed through and if the parse is appropriate
    return (
      <a class={this.type} style={this.customStyle ? JSON.parse(this.customStyle) : null} target="_blank" href={this.href}>
        <slot></slot>
      </a>
    );
  }

}
