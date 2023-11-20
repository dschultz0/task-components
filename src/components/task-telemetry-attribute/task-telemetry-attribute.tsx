import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'task-telemetry-attribute',
  styleUrl: 'task-telemetry-attribute.css',
  shadow: true,
})
export class TaskTelemetryAttribute {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
