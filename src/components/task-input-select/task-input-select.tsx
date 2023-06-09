import { Component, Host, h, Prop, Element, State, Event, EventEmitter, Method, Watch } from '@stencil/core';
import {
  gatherInputOptions, getAnswerCorrectionElement, getAnswerElement,
  Input,
  InputOption,
  inputOptionKeyboardShortcuts,
  KeyboardShortcut,
} from '../../utils/utils';
import { TaskAnswer } from '../task-answer/task-answer';
import { TaskAnswerCorrection } from '../task-answer-correction/task-answer-correction';

@Component({
  tag: 'task-input-select',
  styleUrl: 'task-input-select.css',
  scoped: true,
})
export class TaskInputSelect implements Input {
  @Prop() name: string;
  @Prop() required: boolean;
  @Prop() label: string;
  @Prop() active: boolean = true;
  @Prop() disabled: boolean = false;
  @Element() host: HTMLElement;
  @State() options: Array<InputOption> = [];
  @State() value: string;
  @State() shortcutMap: Map<string, string> = new Map<string, string>();
  @State() answer: TaskAnswer
  @State() answerCorrection: TaskAnswerCorrection
  @State() preventChanges: boolean
  @Event() inputUpdated: EventEmitter<HTMLElement>
  @Event() registerKeyboardShortcut: EventEmitter<KeyboardShortcut>
  input!: HTMLSelectElement

  componentWillLoad() {
    this.options = gatherInputOptions(this.host)
    for (let ks of inputOptionKeyboardShortcuts(this.options)) {
      this.shortcutMap[ks.keys] = ks.value
      this.registerKeyboardShortcut.emit(ks)
    }
    this.answer = getAnswerElement(this.host)
    this.answerCorrection = getAnswerCorrectionElement(this.host)
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
    if (this.answer && this.answerCorrection && this.answerCorrection.displayOn === "submit") {
      if (this.answerCorrection.preventChanges) {
        this.preventChanges = true
      }
      if (this.value !== this.answer.value) {
        this.answerCorrection.displayCorrection = true
        this.inputUpdated.emit(this.input.form)
        return false
      }
    }
    return true
  }

  @Watch("value")
  handleValueUpdate() {
    this.inputUpdated.emit(this.input.form)
  }

  render() {
    return (
      <Host>
        <label>
          {this.label}
          <div class="select">
            <select
              name={this.name}
              required={this.required}
              disabled={this.disabled}
              onChange={e => this.handleChange(e)}
              ref={el => this.input = el}
            >
              {this.options.map(option =>
                <option
                  value={option.value}
                  selected={option.value === this.value}
                >{option.innerHTML}</option>)}
            </select>
          </div>
        </label>
      </Host>
    )
  }

}
