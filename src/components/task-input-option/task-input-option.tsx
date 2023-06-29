import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'task-input-option',
  styleUrl: 'task-input-option.css',
  scoped: true,
})
export class TaskInputOption {
  @Prop() value: string;
  @Prop() keyboardShortcut: string;

  render() {
    return (<Host></Host>);
  }
}
