import { Component, Host, h, State, Element, Listen, Watch } from '@stencil/core';
import { TaskStep } from '../task-step/task-step';
import { ignoreKeypress } from '../../utils/utils';

@Component({
  tag: 'task-steps',
  styleUrl: 'task-steps.css',
  scoped: true,
})
export class TaskSteps {
  @State() activeStep: number = 0
  @State() steps: TaskStep[]
  @Element() host: HTMLElement

  componentWillLoad() {
    this.steps = (Array.from(this.host.children).filter(node => node.nodeName === "TASK-STEP") as unknown[]) as TaskStep[]
    this.updateActiveStep()
  }

  updateActiveStep() {
    for (let step of this.steps) {
      step.active = this.activeStep === this.steps.indexOf(step)
    }
  }

  @Listen("cardClicked")
  cardClickedHandler(event: CustomEvent<HTMLElement>) {
    const target = (event.detail as unknown) as TaskStep
    if (this.steps.includes(target)) {
      this.activeStep = this.steps.indexOf(target)
    }
  }

  @Listen("cardReadyToSubmit")
  cardReadyToSubmitHandler(event: CustomEvent<boolean>) {
    if (event.detail && !ignoreKeypress()) {
      this.activeStep = Math.min(this.activeStep + 1, this.steps.length - 1)
    }
  }

  @Watch("activeStep")
  activeStepUpdated() {
    this.updateActiveStep()
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
