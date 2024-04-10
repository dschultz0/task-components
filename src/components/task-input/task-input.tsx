import { Host, Component, h, Prop, State, Event, EventEmitter, Element, Method, Watch, AttachInternals } from '@stencil/core';
import { Input, InputBase, InputEventTarget } from '../../utils/inputBase';
import { TaskAnswer } from '../task-answer/task-answer';
import { TaskAnswerCorrection } from '../task-answer-correction/task-answer-correction';
import { CallbackFunction } from '../../utils/utils';


@Component({
  tag: 'task-input',
  styleUrl: 'task-input.css',
  scoped: true,
  formAssociated: true,
})
export class TaskInput implements Input {
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
  @Event() inputUpdated: EventEmitter<HTMLElement>
  @Element() host: HTMLElement
  input!: HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement
  fromInput!: InputEventTarget
  form!: HTMLFormElement
  loadCallback!: CallbackFunction
  formCallback!: CallbackFunction
  displayOnCallback!: CallbackFunction

  @Prop() type: string = "text"
  @Prop() rows: number
  @Prop() cols: number
  @Prop() size: number
  @Prop() maxlength: number
  @Prop() placeholder: string

  @AttachInternals() internals: ElementInternals

  componentWillLoad = InputBase.prototype.componentWillLoad
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

  text() {
    return <input
      type="text"
      class="input"
      placeholder={this.placeholder}
      size={this.size}
      maxLength={this.maxlength}
      required={this.required}
      disabled={this.disabled}
      onInput={e => {
        this.value = (e.target as HTMLInputElement).value
        this.internals.setFormValue((e.target as HTMLInputElement).value)
      }}
      ref={el => this.input = el}
      value={this.value}
    ></input>
  }

  textarea() {
    return <textarea
      class="input"
      rows={this.rows}
      cols={this.cols}
      placeholder={this.placeholder}
      maxLength={this.maxlength}
      required={this.required}
      disabled={this.disabled}
      onInput={e => this.value = (e.target as HTMLTextAreaElement).value}
      ref={el => this.input = el}
    >{this.value}</textarea>
  }

  render() {
    return (
      <Host>
        {!this.hidden && <label class={this.labelClass}>
          {this.label} {this.required && this.requiredIndicator ? this.requiredIndicator : ""}
          {this.type === "textarea" && this.textarea()}
          {this.type === "text" && this.text()}
        </label>}
      </Host>
    );
  }
}
