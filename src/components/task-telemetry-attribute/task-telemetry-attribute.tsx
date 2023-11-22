import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'task-telemetry-attribute',
  styleUrl: 'task-telemetry-attribute.css',
  shadow: true,
})
export class TaskTelemetryAttribute {
  @Prop() name: string
  @Prop() value: string

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
