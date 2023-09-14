import { Component, Host, h, Prop, State, Element, Listen, Event, EventEmitter, Watch, Method } from '@stencil/core';
import {
  gatherInputOptions,
  ignoreKeypress,
  Input,
  inputOptionKeyboardShortcuts,
  KeyboardShortcut,
  getAnswerElement,
  getAnswerCorrectionElement
} from '../../utils/utils';
import {TaskAnswer} from '../task-answer/task-answer';
import { TaskAnswerCorrection } from '../task-answer-correction/task-answer-correction';
import classNames from 'classnames';

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
  // Display the options inline
  @Prop() inline: boolean;
  // An attribute that is used in card layouts to indicate that this input is active.
  @Prop() active: boolean = true;
  // Indicates that the input is disabled and can't be edited
  // Note that it appears crowd-form ignores disabled inputs, so we have to use an alt approach here
  @Prop() disabled: boolean = false
  // The tag that will be used to indicate which value is contained in the task-answer
  @Prop() mode: string = "radio"
  @Prop() answerTag: string = "Answer"
  @Element() host: HTMLElement;
  @State() options: HTMLTaskInputOptionElement[];
  @State() value: string;
  @State() shortcutMap: Map<string, string> = new Map<string, string>();
  @State() answer: TaskAnswer
  @State() answerCorrection: TaskAnswerCorrection
  @State() preventChanges: boolean
  @Event() inputUpdated: EventEmitter<HTMLFormElement>
  @Event() registerKeyboardShortcut: EventEmitter<KeyboardShortcut>
  input!: HTMLInputElement

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
    if (event.key in this.shortcutMap && this.active && !ignoreKeypress() && !this.disabled && !this.preventChanges) {
      const advance = this.value === this.shortcutMap[event.key]
      this.value = this.shortcutMap[event.key]
      // If the value will not change as a result of the key press, trigger card advance from here
      if (advance) {
        this.inputUpdated.emit(this.input.form)
      }
      // The following addresses an issue observed with dependent form elements
      // not receiving form updated events when the value is changed via keypress
      this.input.form.elements[this.name].value = this.shortcutMap[event.key]
      this.input.form.dispatchEvent(new InputEvent("input"))
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
    this.inputUpdated.emit(this.input.form)
  }

  @Method()
  async readyToSubmit() {
    return Boolean(this.value)
  }

  hasAnswerToValidate = () => {
    return this.answer && this.answerCorrection
  }

  @Method()
  async validateAgainstAnswer() {
    return !(this.hasAnswerToValidate() && this.answerCorrection.displayOn === "submit" && this.value !== this.answer.value)
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

  renderRadio() {
    return this.options.map(option =>
      <label class={classNames("radio", {"inline": this.inline})}>
        <input
          key="input"
          type="radio"
          name={this.name}
          value={option.value}
          required={this.required}
          onChange={e => this.handleChange(e)}
          checked={option.value === this.value}
          disabled={this.disabled || (this.preventChanges && option.value !== this.value)}
          ref={el => this.input = el}
          // Prevents the input getting focus and changing values using arrow keys
          onClick={(e) => (e.target as HTMLInputElement).blur()}
        />
        { this.mode === "radio" && <span class="indicator" key="indicator"></span> }
        <div
          key="content"
          class={classNames("content", {"inline": this.inline})}
          innerHTML={option.innerHTML}
        />
        {this.answer &&
          this.answer.value === option.value &&
          (this.answer.showAnswer || (
              this.answerCorrection.showAnswer &&
              this.answerCorrection.displayCorrection)
          ) &&
          <task-tag
            key="answer"
            round={true}
            color="red"
            small={true}
            style={{marginLeft: "4px"}}
          >
            {this.answerTag}
          </task-tag>}
      </label>)
  }

  renderButtonGroup() {
    return <task-button-group>
      {this.options.map(option =>
        <task-button
          label={true}
          class={classNames("radio", {"inline": this.inline})}
          selected={option.value === this.value}
          onClick={() => this.value = option.value}
        >
          <input
            key="input"
            type="radio"
            name={this.name}
            value={option.value}
            required={this.required}
            checked={option.value === this.value}
            disabled={this.disabled || (this.preventChanges && option.value !== this.value)}
            ref={el => this.input = el}
            // Prevents the input getting focus and changing values using arrow keys
            onClick={(e) => (e.target as HTMLInputElement).blur()}
          />
          <div
            key="content"
            class={classNames("content", {"inline": this.inline})}
            innerHTML={option.innerHTML}
          />
        </task-button>)}
    </task-button-group>
  }

  render() {
    return (
      <Host>
        {this.label && <task-label>{this.label}</task-label>}
        {this.mode === "button" ? this.renderButtonGroup() : this.renderRadio()}
        <slot></slot>
      </Host>
    )
  }
}
