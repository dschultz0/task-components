import { Component, Host, h, Event, EventEmitter, Prop, State, Element, Method, Watch, Listen } from '@stencil/core';
import { Input, InputBase, InputEventTarget } from '../../utils/inputBase';
import {
  CallbackFunction,
  gatherInputOptions, ignoreKeypress,
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
  /*
  The first block of values are common attributes of the Input type that are implemented here
   */
  // The name assigned to the input element. This will identify the value in your task results.
  @Prop() name: string
  // A label that will be attached to the input
  @Prop() label: string
  // Class to apply to the label
  @Prop() labelClass: string
  // Indicates that the field is required and must be provided before submit.
  @Prop({mutable: true}) required: boolean
  // An attribute that is used in card layouts to indicate that this input is active.
  @Prop() active: boolean
  // Indicates that the input is disabled and can't be edited
  // Note that it appears crowd-form ignores disabled inputs, so we have to use an alt approach here
  @Prop({mutable: true}) disabled: boolean
  // Specifies a formula to determine whether to disable the field
  @Prop() disableIf: string
  // Specifies a formula to compute if the field is required
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
  @Event() inputUpdated: EventEmitter<HTMLElement>
  @Element() host: HTMLElement
  input!: HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement
  fromInput!: InputEventTarget
  form!: HTMLFormElement
  loadCallback!: CallbackFunction
  formCallback!: CallbackFunction
  displayOnCallback!: CallbackFunction

  options: HTMLTaskInputOptionElement[];
  shortcutMap: Map<string, string> = new Map<string, string>();
  @Event() registerKeyboardShortcut: EventEmitter<KeyboardShortcut>

  componentWillLoad() {
    InputBase.prototype.componentWillLoad.bind(this)()
    this.options = gatherInputOptions(this.host)
    for (let ks of inputOptionKeyboardShortcuts(this.options)) {
      this.shortcutMap[ks.keys] = ks.value
      this.registerKeyboardShortcut.emit(ks)
    }
  }
  connectedCallback() {
    InputBase.prototype.connectedCallback.bind(this)()
  }
  disconnectedCallback = InputBase.prototype.disconnectedCallback
  formUpdated = InputBase.prototype.formUpdated
  setupDependentInputs = InputBase.prototype.setupDependentInputs
  hasAnswerToValidate = InputBase.prototype.hasAnswerToValidate
  handleParentElementUpdate  = InputBase.prototype.handleParentElementUpdate
  fromInputUpdated = InputBase.prototype.fromInputUpdated.bind(this)
  @Method()
  async readyToSubmit() {return InputBase.prototype.readyToSubmit.bind(this)()}
  @Method()
  async validateAgainstAnswer() {return InputBase.prototype.validateAgainstAnswer.bind(this)()}
  @Method()
  async setShowCorrections() {return InputBase.prototype.setShowCorrections.bind(this)()}
  @Watch("value")
  @Watch("required")
  async handleValueUpdate() {return InputBase.prototype.handleValueUpdate.bind(this)()}


  @Listen("keypress", { target: "document" })
  keypressHandler(event: KeyboardEvent) {
    if (event.key in this.shortcutMap && this.active && !ignoreKeypress() && !this.disabled && !this.preventChanges) {
      const advance = this.value === this.shortcutMap[event.key]
      this.value = this.shortcutMap[event.key]
      // If the value doesn't change as a result of the key press, trigger card advance from here
      if (advance) {
        this.inputUpdated.emit(this.input.form)
      }
      // The following addresses an issue observed with dependent form elements
      // not receiving form updated events when the value is changed via keypress
      this.input.form.elements[this.name].value = this.shortcutMap[event.key]
      this.input.form.dispatchEvent(new InputEvent("input"))
    }
  }


  render() {
    return (
      <Host>
        {!this.hidden && <label class={this.labelClass}>
          {this.label}
          <div class="select">
            <select
              name={this.name}
              required={this.required}
              disabled={this.disabled}
              onChange={e => this.value = (e.target as HTMLInputElement).value}
              ref={el => this.input = el}
            >
              {this.options.map(option =>
                <option
                  value={option.value}
                  selected={option.value === this.value}
                >{option.innerHTML}</option>)}
            </select>
          </div>
        </label>}
        <slot/>
      </Host>
    )
  }
}
