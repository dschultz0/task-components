import { Host, Component, Event, EventEmitter, h, Method, Prop, State, Watch, Element } from '@stencil/core';
import {
  getAnswerCorrectionElement,
  getAnswerElement,
  Input,
} from '../../utils/utils';
import { TaskAnswer } from '../task-answer/task-answer';
import { TaskAnswerCorrection } from '../task-answer-correction/task-answer-correction';

type CallbackFunction = (this: Window, ev: Event) => any

@Component({
  tag: 'task-input',
  styleUrl: 'task-input.css',
  scoped: true,
})
export class TaskInput implements Input {
  @Prop() name: string
  @Prop() type: string
  @Prop() label: string
  @Prop() labelClass: string
  @Prop() rows: number
  @Prop() cols: number
  @Prop() size: number
  @Prop() maxlength: number
  @Prop() placeholder: string
  @Prop({mutable: true}) required: boolean
  @Prop() active: boolean
  @Prop() disabled: boolean
  @Prop() requireIf: string
  @Prop() requiredIndicator: string
  @Prop() displayOn: string
  @Element() host: HTMLElement
  @State() value: string
  @State() preventChanges: boolean
  @State() answer: TaskAnswer
  @State() answerCorrection: TaskAnswerCorrection
  @State() hidden: boolean
  @Event() inputUpdated: EventEmitter<HTMLElement>
  input!: HTMLInputElement|HTMLTextAreaElement
  loadCallback!: CallbackFunction
  formCallback!: CallbackFunction
  displayOnCallback!: CallbackFunction

  formUpdated() {
    // console.log("formUpdated")
    if (this.requireIf.includes("=")) {
      const parts = this.requireIf.split("=")
      if (parts[0].startsWith("any(")) {
        const inputNames = parts[0].substring(4, parts[0].length-1).split(",")
        // console.log(inputNames.map(name => this.input.form.elements[name].value))
        const matching = inputNames.filter(name => this.input.form.elements[name].value === parts[1])
        this.required = matching.length > 0
      }
    }
  }

  setupDependentInputs() {
    if (this.requireIf && this.input) {
      this.formCallback = this.formUpdated.bind(this)
      this.input.form.addEventListener('input', this.formCallback)
    }
  }

  handleParentElementUpdate() {
    ((this.host.parentElement as unknown) as Input).getValue().then(value => {
      this.hidden = (value !== this.displayOn)
    })
  }

  connectedCallback() {
    if (this.requireIf) {
      if (['loaded', 'interactive', 'complete'].includes(document.readyState)) {
        this.setupDependentInputs()
      } else {
        this.loadCallback = this.setupDependentInputs.bind(this)
        document.addEventListener("load", this.setupDependentInputs)
      }
    }
    // TODO: Modify the check to better check for input type
    if (this.displayOn && this.host.parentElement.tagName.startsWith("TASK-INPUT")) {
      this.handleParentElementUpdate()
      this.displayOnCallback = this.handleParentElementUpdate.bind(this)
      this.host.parentElement.addEventListener("inputUpdated", this.displayOnCallback)
    }
  }
  componentWillLoad() {
    this.answer = getAnswerElement(this.host)
    this.answerCorrection = getAnswerCorrectionElement(this.host)
  }

  disconnectedCallback() {
    if (this.loadCallback) {
      document.removeEventListener("load", this.loadCallback)
    }
    if (this.formCallback) {
      this.input.form.removeEventListener("input", this.formCallback)
    }
    if (this.displayOnCallback) {
      this.host.parentElement.removeEventListener("inputUpdated", this.displayOnCallback)
    }
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

  text() {
    return <input
      type="text"
      name={this.name}
      class="input"
      placeholder={this.placeholder}
      size={this.size}
      maxLength={this.maxlength}
      required={this.required}
      onInput={e => this.handleChange(e)}
      ref={el => this.input = el}
      value={this.value}
    ></input>
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

  @Method()
  async getValue() {
    return this.value
  }

  @Watch("value")
  @Watch("required")
  handleValueUpdate() {
    this.inputUpdated.emit(this.input.form)
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
