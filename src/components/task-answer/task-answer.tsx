import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'task-answer',
  styleUrl: 'task-answer.css',
  scoped: true,
})
export class TaskAnswer {
  @Prop() value: string
  @Prop() showAnswer: boolean = false

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
