import { Component, Host, h, Prop, State, Element, Listen, Event, EventEmitter, Watch, Method } from '@stencil/core';
import {
  gatherInputOptions,
  ignoreKeypress,
  Input,
  InputOption,
  inputOptionKeyboardShortcuts,
  KeyboardShortcut,
  getAnswerElement,
  getAnswerCorrectionElement
} from '../../utils/utils';
import {TaskAnswer} from '../task-answer/task-answer';
import { TaskAnswerCorrection } from '../task-answer-correction/task-answer-correction';

@Component({
  tag: 'task-input-radio',
  styleUrl: 'task-input-radio.css',
  scoped: true,
})
export class TaskInputRadio implements Input {
  // The name assigned to the input element. This will identify the value in your task results.
  @Prop() name: string;
  // Indicates that the field is required and must be provided before submit.
  @Prop() required: boolean;
  // A label that will be attached to the input
  @Prop() label: string;
  // An attribute that is used in card layouts to indicate that this input is active.
  @Prop() active: boolean = true;
  // Indicates that the input is disabled and can't be edited
  // Note that it appears crowd-form ignores disabled inputs, so we have to use an alt approach here
  @Prop() disabled: boolean = false
  // The tag that will be used to indicate which value is contained in the task-answer
  @Prop() answerTag: string = "Answer"
  @Element() host: HTMLElement;
  @State() options: Array<InputOption> = [];
  @State() value: string;
  @State() shortcutMap: Map<string, string> = new Map<string, string>();
  @State() answer: TaskAnswer
  @State() answerCorrection: TaskAnswerCorrection
  @State() preventChanges: boolean
  @Event() inputUpdated: EventEmitter<HTMLElement>
  @Event() registerKeyboardShortcut: EventEmitter<KeyboardShortcut>

  componentWillLoad() {
    this.options = gatherInputOptions(this.host)
    for (let ks of inputOptionKeyboardShortcuts(this.options)) {
      this.shortcutMap[ks.keys] = ks.value
      this.registerKeyboardShortcut.emit(ks)
    }
    this.answer = getAnswerElement(this.host)
    this.answerCorrection = getAnswerCorrectionElement(this.host)
  }

  @Listen("keypress", { target: "document" })
  keypressHandler(event: KeyboardEvent) {
    if (event.key in this.shortcutMap && this.active && !ignoreKeypress() && !this.disabled) {
      const advance = this.value === this.shortcutMap[event.key]
      this.value = this.shortcutMap[event.key]
      // If the value will not change as a result of the key press, trigger card advance from here
      if (advance) {
        this.inputUpdated.emit(this.host)
      }
    }
  }

  handleChange(event: Event) {
    this.value = (event.target as HTMLInputElement).value
  }

  @Watch("value")
  handleValueUpdate(value) {
    if (this.answer && this.answerCorrection && this.answerCorrection.displayOn === "mismatch") {
      this.answerCorrection.displayCorrection = (this.answer.value !== value)
    }
    this.inputUpdated.emit(this.host)
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
        this.inputUpdated.emit(this.host)
        return false
      }
    }
    return true
  }

  render() {
    return (
      <Host>
        {this.label && <div>{this.label}</div>}
        {this.options.map(option => <label class="radio">
          <input
            type="radio"
            name={this.name}
            value={option.value}
            required={this.required}
            onChange={e => this.handleChange(e)}
            checked={option.value === this.value}
            disabled={this.disabled || (this.preventChanges && option.value !== this.value)}
          />
          <span class="indicator"></span>
          {option.innerHTML}
          {this.answer &&
            this.answer.value === option.value &&
            (this.answer.showAnswer || (
              this.answerCorrection.showAnswer &&
                this.answerCorrection.displayCorrection)
            ) &&
            <task-tag round={true} color="red" small={true} style={{marginLeft: "4px"}}>{this.answerTag}</task-tag>}
        </label>)}
        <slot></slot>
      </Host>
    )
  }
}
