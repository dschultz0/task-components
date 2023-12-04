import { Component, Host, h, Prop, Listen, Event, EventEmitter, Watch, Method, Fragment, State, Element } from '@stencil/core';
import { Input, InputBase, InputEventTarget, InputUpdatedEvent } from '../../utils/inputBase';
import { TaskAnswer } from '../task-answer/task-answer';
import { TaskAnswerCorrection } from '../task-answer-correction/task-answer-correction';

import {
  CallbackFunction,
  gatherInputOptions,
  inputOptionKeyboardShortcuts,
  KeyboardShortcut,
} from '../../utils/utils';
import classNames from 'classnames';

@Component({
  tag: 'task-input-radio',
  styleUrl: 'task-input-radio.css',
  scoped: true,
})
export class TaskInputRadio implements Input {
  /*
  The first block of values are common attributes of the Input type that are implemented here
   */
  // The name assigned to the input element. This will identify the value in your task results.
  @Prop() name: string
  // A label that will be attached to the input
  @Prop() label: string
  // Class to apply to the label
  @Prop() labelClass: string
  // Display the keyboard shortcut behind the label
  @Prop() labelShortcuts: boolean
  // Indicates that the field is required and must be provided before submit.
  @Prop({mutable: true}) required: boolean
  // Indicates that the input is disabled and can't be edited
  // Note that it appears crowd-form ignores disabled inputs, so we have to use an alt approach here
  @Prop({mutable: true}) disabled: boolean
  // Specifies a formula to determine whether to disable the field
  @Prop() disableIf: string
  // Specifies that a formula to compute if the field is required
  @Prop() requireIf: string
  // Text to append to the label to indicate the field is required
  @Prop() requiredIndicator: string
  // Specifies the value of the parent component that will result in displaying this input
  @Prop() displayOn: string
  // Specifies a formula to compute if the field will be displayed
  @Prop() displayIf: string
  @Prop({mutable: true}) value: string
  @Prop() valueFrom: string
  @Prop({mutable: true}) hidden: boolean
  @State() preventChanges: boolean
  @State() answer: TaskAnswer
  @State() answerCorrection: TaskAnswerCorrection
  @Event({eventName: "tc:input"}) inputUpdated: EventEmitter<InputUpdatedEvent>
  @Element() host: HTMLElement
  input!: HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement
  fromInput!: InputEventTarget
  form!: HTMLFormElement
  loadCallback!: CallbackFunction
  formCallback!: CallbackFunction
  displayOnCallback!: CallbackFunction


  @Prop() mode: string = "radio"
  // Display the options inline
  @Prop() inline: boolean;
  // The tag that will be used to indicate which value is contained in the task-answer
  @Prop() answerTag: string = "Answer"
  options: HTMLTaskInputOptionElement[];
  shortcutMap: Map<string, string> = new Map<string, string>();
  @Event() registerKeyboardShortcut: EventEmitter<KeyboardShortcut>

  connectedCallback() {
    InputBase.prototype.connectedCallback.bind(this)()
  }
  disconnectedCallback = InputBase.prototype.disconnectedCallback
  formUpdated = InputBase.prototype.formUpdated
  setupDependentInputs = InputBase.prototype.setupDependentInputs
  handleParentElementUpdate  = InputBase.prototype.handleParentElementUpdate
  fromInputUpdated = InputBase.prototype.fromInputUpdated.bind(this)
  @Method()
  async readyToSubmit() {return InputBase.prototype.readyToSubmit.bind(this)()}
  @Method()
  async setShowCorrections() {return InputBase.prototype.setShowCorrections.bind(this)()}

  componentWillLoad() {
    InputBase.prototype.componentWillLoad.bind(this)()
    this.options = gatherInputOptions(this.host)
    for (let ks of inputOptionKeyboardShortcuts(this.options)) {
      this.shortcutMap[ks.keys] = ks.value
      this.registerKeyboardShortcut.emit(ks)
    }
  }

  @Listen("keypress", { target: "document", capture: false })
  keypressHandler(event: KeyboardEvent) {
    if (event.key in this.shortcutMap &&
      (document.activeElement === this.host || this.host.contains(document.activeElement) || document.activeElement.contains(this.host)) &&
      !this.disabled &&
      !this.preventChanges
    ) {
      const advance = this.value === this.shortcutMap[event.key]
      this.value = this.shortcutMap[event.key]
      this.inputUpdated.emit({input: this.input, form: this.form, advance})
      event.stopImmediatePropagation()
      // The following addresses an issue observed with dependent form elements
      // not receiving form updated events when the value is changed via keypress
      //this.input.form.elements[this.name].value = this.shortcutMap[event.key]
      //this.input.form.dispatchEvent(new InputEvent("input"))
    }
  }

  @Watch("value")
  handleValueUpdate(value: string) {
    InputBase.prototype.handleValueUpdate.bind(this)(value)
    if (this.answer && this.answerCorrection && this.answerCorrection.displayOn === "mismatch") {
      this.answerCorrection.displayCorrection = (this.answer.value !== value)
    }
  }

  hasAnswerToValidate = () => {
    // TODO: Review why this is different from the others
    return this.answer && this.answerCorrection && true
  }

  @Method()
  async validateAgainstAnswer() {
    // TODO: Review why this is different from the others
    return !(this.hasAnswerToValidate() && this.answerCorrection.displayOn === "submit" && this.value !== this.answer.value)
  }

  handleRadioChange(event: Event) {
    this.value = (event.target as HTMLInputElement).value
  }

  renderRadio() {
    return this.options.map((option, i) =>
      <label class={classNames("radio", {"inline": this.inline})} id={`${this.name}${i}`} tabindex={-1}>
        <input
          key="input"
          type="radio"
          name={this.name}
          value={option.value}
          required={this.required}
          onChange={e => this.value = (e.target as HTMLInputElement).value}
          checked={option.value === this.value}
          disabled={this.disabled || (this.preventChanges && option.value !== this.value)}
          ref={el => this.input = el}
          tabindex={-1}
          // Prevents the input getting focus and changing values using arrow keys
          // onClick={(e) => (e.target as HTMLInputElement).blur()}
        />
        { this.mode === "radio" && <span class="indicator" key="indicator"></span> }
        { this.labelShortcuts && option.keyboardShortcut ?
          <div
            key="content"
            class={classNames("content", {"inline": this.inline})}
          >
            <div style={{display: "inline"}}
              innerHTML={option.innerHTML}/>
            <sup>&nbsp;{option.keyboardShortcut}</sup>
          </div>
        : <div
            key="content"
            class={classNames("content", {"inline": this.inline})}
            innerHTML={option.innerHTML}
          />}
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
            // onClick={(e) => (e.target as HTMLInputElement).blur()}
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
    /*
    let tabIndex = "tabindex" in this.host.attributes ? this.host.tabIndex : 0
    if (this.disabled || this.hidden) {
      tabIndex = -1
    }*/
    return (
      <Host tabindex={0}>
        {!this.hidden && <Fragment>
            {this.label && <task-label class={this.labelClass}>{this.label}</task-label>}
            {this.mode === "button" ? this.renderButtonGroup() : this.renderRadio()}
          </Fragment>}
        <slot></slot>
      </Host>
    )
  }
}
