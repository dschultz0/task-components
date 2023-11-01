import { Component, Host, h, Prop, Element, State } from '@stencil/core';
import { attachInputListener, CallbackFunction, InputEventTarget } from '../../utils/inputBase';

@Component({
  tag: 'task-var',
  styleUrl: 'task-var.css',
  scoped: true,
})
export class TaskVar {
  // The name of the data attribute that should be displayed
  @Prop() data: string
  // The name of the input element that contains the value to be displayed
  @Prop() name: string
  @Element() host: HTMLElement
  @State() value: string
  input: InputEventTarget
  loadCallback: CallbackFunction
  inputCallback: CallbackFunction

  componentWillLoad() {
    if (this.data) {
      let element: HTMLElement = this.host
      while (element.parentElement && !this.value) {
        element = element.parentElement
        if (this.data in element.dataset) {
          this.value = element.dataset[this.data]
        }
      }
    } else if (this.name) {
      if (['interactive', 'complete'].includes(document.readyState)) {
        this.setupInputListener()
      } else {
        this.loadCallback = this.setupInputListener.bind(this)
        document.addEventListener("load", this.setupInputListener)
      }
    }
  }
  disconnectedCallback() {
    if (this.loadCallback) {
      document.removeEventListener("load", this.loadCallback)
    }
    if (this.inputCallback && this.input) {
      // TODO: Look at this
      // Commented out because the immediate disconnect event is overlapping and deleting early
      // this.input.removeEventListener("inputUpdated", this.inputCallback)
    }
  }

  setupInputListener() {
    this.inputCallback = this.inputUpdated.bind(this)
    attachInputListener(this.name, this.inputCallback)
      .then(input => {
        this.input = input
        this.inputUpdated()
      })
  }

  inputUpdated() {
    if (this.input) {
      this.value = this.input.value
    }
  }

  render() {
    return (
      <Host>
        {this.value}
        <slot></slot>
      </Host>
    );
  }

}
