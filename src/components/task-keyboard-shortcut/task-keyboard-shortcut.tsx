import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'task-keyboard-shortcut',
  styleUrl: 'task-keyboard-shortcut.css',
  scoped: true,
})
export class TaskKeyboardShortcut {
  @Prop() keyboardShortcut: string

  render() {
    return (<Host></Host>);
  }

}
