import { Component, Host, h, Prop, Element, EventEmitter, Event } from '@stencil/core';

@Component({
  tag: 'task-dialog',
  styleUrl: 'task-dialog.css',
  scoped: true,
})
export class TaskDialog {
  @Prop() isOpen: boolean = true
  @Prop() headerText: string
  @Prop() isCloseButtonShown: boolean = true
  @Event() close: EventEmitter
  @Element() host

  header() {
    if (this.headerText === null) {
      return null
    }
    return <div class="dialog-header">
      <h6>{this.headerText}</h6>
      {this.isCloseButtonShown &&
        <task-button
          class=''
          icon='small-cross'
          minimal={true}
          on-click={() => this.close.emit()}>
        </task-button>}
    </div>
  }

  render() {
    return (
      <Host>
        <task-overlay is-open={this.isOpen} has-backdrop={true} container-class="overlay-scroll-container">
          <div class="dialog-container">
            <div class="dialog" role="dialog">
              {this.header()}
              <slot></slot>
            </div>
          </div>
        </task-overlay>
      </Host>
    )
  }

}
