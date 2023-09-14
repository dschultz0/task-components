import { Component, Host, h, Prop, Element, State } from '@stencil/core';
import { computePosition, autoUpdate, flip, shift, offset } from '@floating-ui/dom';

@Component({
  tag: 'task-tooltip',
  styleUrl: 'task-tooltip.css',
  scoped: true,
})
export class TaskTooltip {
  @Prop() icon: string
  @Element() host: HTMLElement
  @State() display: boolean = false
  target!: HTMLElement
  tooltip!: HTMLDivElement
  cleanup!: Function

  componentDidLoad() {
    this.target.addEventListener("click", this.handleTargetClick.bind(this))
    this.tooltip.addEventListener("click", this.handleTooltipClick.bind(this))
  }

  handleTargetClick() {
    this.display = !this.display
    if (this.display) {
      this.cleanup = autoUpdate(this.target, this.tooltip, this.updatePosition.bind(this))
    } else if (this.cleanup) {
      this.cleanup()
    }
  }

  handleTooltipClick() {
    this.display = false
  }

  updatePosition() {
    computePosition(
      this.target,
      this.tooltip,
      {
        placement: "bottom-start",
        middleware: [offset(6), flip(), shift({padding: 5})]
      }).then(({ x, y }) => {
      Object.assign(this.tooltip.style, {
        left: `${x}px`,
        top: `${y}px`,
      })
    })
  }

  render() {
    return (
      <Host>
        <task-icon icon={this.icon} ref={el => this.target = el as HTMLElement}></task-icon>
        <div
          class={"tooltip " + (this.display ? "" : "tooltip-hidden")}
          ref={el => this.tooltip = el as HTMLDivElement}
        >
          <slot></slot>
        </div>
      </Host>
    )
  }

}
