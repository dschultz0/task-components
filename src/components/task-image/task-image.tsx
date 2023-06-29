import { Component, Host, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'task-image',
  styleUrl: 'task-image.css',
  shadow: true,
})
export class TaskImage {
  @Prop() src: string
  @State() image: HTMLImageElement
  canvasElement!: HTMLCanvasElement

  componentWillLoad() {
    this.image = new Image()
    this.image.src = this.src
    this.image.decode().then(() => {
      const ctx = this.canvasElement.getContext("2d")
      console.log(this.canvasElement)
      console.log(this.image)
      this.canvasElement.width = this.image.width
      this.canvasElement.height = this.image.height
      ctx.drawImage(this.image, 0, 0, this.canvasElement.width, this.canvasElement.height)
    })
  }

  render() {
    return (
      <Host>
        <canvas ref={el => this.canvasElement = el}/>
      </Host>
    );
  }

}
