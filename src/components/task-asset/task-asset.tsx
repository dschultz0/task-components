import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'task-asset',
  shadow: false,
})
export class TaskAsset {
  @Prop() asset: string
  @Prop() value: string

  render() {
    return null
  }

}
