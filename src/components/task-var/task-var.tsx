import { Component, Host, h, Prop, Element, State } from '@stencil/core';
import { CallbackFunction } from '../../utils/inputBase';

@Component({
  tag: 'task-var',
  styleUrl: 'task-var.css',
  scoped: true,
})
export class TaskVar {
  @Prop() name: string
  @Prop() field: string
  @Element() host: HTMLElement
  @State() value: string
  input: HTMLInputElement
  loadCallback: CallbackFunction
  inputCallback: CallbackFunction

  componentWillLoad() {
    if (this.name) {
      let element: HTMLElement = this.host
      while (element.parentElement && !this.value) {
        element = element.parentElement
        if (this.name in element.dataset) {
          this.value = element.dataset[this.name]
        }
      }
    } else if (this.field) {
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
      this.input.removeEventListener("input", this.inputCallback)
    }
  }

  setupInputListener() {
    this.input = document.querySelector(`[name='${this.field}']`)
    if (this.input) {
      this.inputCallback = this.formUpdated.bind(this)
      this.input.addEventListener("inputUpdated", this.inputCallback)
      this.formUpdated()
    } else {
      setTimeout(this.setupInputListener.bind(this), 1000)
    }
  }

  formUpdated() {
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
