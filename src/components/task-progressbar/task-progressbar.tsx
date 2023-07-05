import { Component, Host, h, Prop, Watch, State, Method } from '@stencil/core';
import { TaskCard } from '../task-card/task-card';
import { Components } from '../../components';
import TaskStep = Components.TaskStep;

@Component({
  tag: 'task-progressbar',
  styleUrl: 'task-progressbar.css',
  scoped: true,
})
export class TaskProgressbar {
  @Prop({mutable: true}) completedCount: number = 0;
  @Prop({mutable: true}) taskCount: number;
  @Prop() mode: string;
  @State() completePercentage: string = "0";

  componentWillLoad() {
    this.completePercentage = this.computePercentage()
    // TODO: This probably needs to be rerun if the mode changes for some reason
    if (this.mode === "card") {
      const cards = document.querySelectorAll("TASK-CARD")
      this.taskCount = cards.length
    }
    if (this.mode === "step") {
      const steps = document.querySelectorAll("TASK-STEP")
      this.taskCount = steps.length
    }
  }

  @Watch("completedCount")
  @Watch("taskCount")
  watchPercentage() {
    this.completePercentage = this.computePercentage()
  }

  @Method()
  async refreshProgress() {
    if (this.mode === "card") {
      const cards = document.querySelectorAll("TASK-CARD")
      Promise.all(Array.from(cards).map(card => ((card as unknown) as TaskCard).readyToSubmit()))
        .then(values => {
          this.completedCount = values.reduce((n: number, v) => n + Number(v), 0)
        })
    }
    if (this.mode === "step") {
      const steps = document.querySelectorAll("TASK-STEP")
      Promise.all(Array.from(steps).map(step => ((step as unknown) as TaskStep).readyToSubmit()))
        .then(values => {
          this.completedCount = values.reduce((n: number, v) => n + Number(v), 0)
        })
    }
  }

  computePercentage() {
    if (this.taskCount > 0) {
      return (this.completedCount/this.taskCount*100).toString() + "%"
    } else {
      return "0"
    }
  }

  render() {
    return (
      <Host>
        <div class="bar">
          <div class="meter" style={{"width": this.completePercentage}}></div>
        </div>
        <slot>
          <div class="text">Completed {this.completedCount} of {this.taskCount}</div>
        </slot>
      </Host>
    );
  }
}
