import { Component, Event, EventEmitter, h, Method, Prop, State, Watch, Element } from '@stencil/core';
import { Input } from '../../utils/utils';

@Component({
  tag: 'task-input',
  styleUrl: 'task-input.css',
  scoped: true,
})
export class TaskInput implements Input {
  @Prop() name: string;
  @Prop() type: string;
  @Prop() label: string;
  @Prop() rows: number;
  @Prop() cols: number;
  @Prop() maxlength: number;
  @Prop() placeholder: string;
  @Prop() required: boolean
  @Prop() active: boolean
  @Prop() disabled: boolean
  @Element() host
  @State() value: string
  @Event() inputUpdated: EventEmitter<HTMLElement>

  textarea() {
    return <textarea
      name={this.name}
      class="input"
      rows={this.rows}
      cols={this.cols}
      placeholder={this.placeholder}
      maxLength={this.maxlength}
      required={this.required}
      onInput={e => this.handleChange(e)}
    >{this.value}</textarea>
  }

  handleChange(event: Event) {
    this.value = (event.target as HTMLInputElement).value
  }

  @Method()
  async readyToSubmit() {
    return Boolean(this.value)
  }

  @Method()
  async validateAgainstAnswer() {
    // TODO: implement
    return true
  }

  @Watch("value")
  handleValueUpdate() {
    this.inputUpdated.emit(this.host)
  }

  render() {
    return (
      <label>
        {this.label}
        {this.type === "textarea" && this.textarea()}
      </label>
    );
  }
}
