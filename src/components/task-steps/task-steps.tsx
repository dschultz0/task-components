import { Component, Host, h, State, Element, Listen, Watch } from '@stencil/core';
import { TaskCard } from '../task-card/task-card';
import { ignoreKeypress } from '../../utils/utils';

@Component({
  tag: 'task-steps',
  styleUrl: 'task-steps.css',
  scoped: true,
})
export class TaskSteps {
  @State() activeStep: number = 0
  @State() steps: TaskCard[]
  @Element() host: HTMLElement

  componentWillLoad() {
    this.steps = (Array.from(this.host.children).filter(node => node.nodeName === "TASK-CARD") as unknown[]) as TaskCard[]
    this.updateActiveStep()
  }

  componentDidLoad() {
    if (this.steps.length > 0) {
      requestAnimationFrame(() =>
        ((this.steps[0] as unknown) as HTMLElement).focus()
      )
    }
  }

  @Listen("focus", {target: "body"})
  handleFocus() {
    console.log("focus")
  }

  updateActiveStep() {
    //for (let step of this.steps) {
      // step.active = this.activeStep === this.steps.indexOf(step)
    //}
  }

  @Listen("cardClicked")
  cardClickedHandler(event: CustomEvent<HTMLElement>) {
    const target = (event.detail as unknown) as TaskCard
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
