import { Component, Host, h, Prop, State, Method } from '@stencil/core';
import { computeBoxLocation } from '../../utils/image';

@Component({
  tag: 'task-image-box',
  styleUrl: 'task-image-box.css',
  scoped: true,
})
export class TaskImageBox {
  @Prop() top: number
  @Prop() left: number
  @Prop() width: number
  @Prop() height: number
  @Prop() coordinates: string
  @Prop() lineWidth: number = 5
  @Prop() color: string = "green"
  @State() location: number[]

  componentWillLoad() {
    this.location = computeBoxLocation(this.left, this.top, this.width, this.height, this.coordinates)
  }

  @Method()
  async drawBox(context: CanvasRenderingContext2D, scalar: number = 1, xOffset: number = 0, yOffset: number = 0) {
    if (this.location) {
      const l = this.location.map(x => x * scalar)
      context.beginPath()
      context.lineWidth = this.lineWidth
      context.strokeStyle = this.color
      context.rect(l[0] + xOffset, l[1] + yOffset, l[2], l[3])
      context.stroke()
    }
  }

  /*
  This was a small experiment exploring using calculated lineWidth based on weight and dimensions
  computeWidth(width: number, height: number, weight: number) {
    const minDimension = Math.min(width, height)
    console.log("Min dimension: " + minDimension)
    return 5
  }
   */

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
