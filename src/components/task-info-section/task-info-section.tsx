import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'task-info-section',
  styleUrl: 'task-info-section.css',
  scoped: true,
})
export class TaskInfoSection {
  @Prop() header: string;
  render() {
    return (
      <Host>
        {this.header && <div class="header">{this.header}</div>}
        <slot></slot>
      </Host>
    );
  }

}
