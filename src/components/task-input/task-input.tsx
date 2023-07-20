import { Component, Event, EventEmitter, h, Method, Prop, State, Watch, Element } from '@stencil/core';
import {
  getAnswerCorrectionElement,
  getAnswerElement,
  Input,
} from '../../utils/utils';
import { TaskAnswer } from '../task-answer/task-answer';
import { TaskAnswerCorrection } from '../task-answer-correction/task-answer-correction';

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
  @State() preventChanges: boolean
  @State() answer: TaskAnswer
  @State() answerCorrection: TaskAnswerCorrection
  @Event() inputUpdated: EventEmitter<HTMLElement>
  input!: HTMLInputElement|HTMLTextAreaElement

  componentWillLoad() {
    this.answer = getAnswerElement(this.host)
    this.answerCorrection = getAnswerCorrectionElement(this.host)
  }

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
      ref={el => this.input = el}
    >{this.value}</textarea>
  }

  handleChange(event: Event) {
    this.value = (event.target as HTMLInputElement).value
  }

  @Method()
  async readyToSubmit() {
    return Boolean(this.value)
  }

  hasAnswerToValidate = () => {
    return this.answer && this.answerCorrection && this.answerCorrection.displayOn === "submit"
  }

  @Method()
  async validateAgainstAnswer() {
    return !(this.hasAnswerToValidate() && this.value !== this.answer.value)
  }

  @Method()
  async setShowCorrections(value: boolean) {
    if (this.hasAnswerToValidate()) {
      this.preventChanges = this.answerCorrection.preventChanges && value
      if (this.value !== this.answer.value) {
        this.answerCorrection.displayCorrection = value
        if (value) {
          this.inputUpdated.emit(this.input.form)
        }
      }
    }
  }

  @Method()
  async setValue(value: string) {
    this.value = value
  }

  @Watch("value")
  handleValueUpdate() {
    this.inputUpdated.emit(this.input.form)
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
