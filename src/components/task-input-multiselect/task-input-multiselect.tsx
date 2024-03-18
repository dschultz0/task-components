import { Component, Host, h, Prop, State, Event, Element, EventEmitter, Method, Watch } from '@stencil/core';
import { Input, InputBase, InputEventTarget } from '../../utils/inputBase';
import {
  CallbackFunction,
  gatherInputOptions,
  inputOptionKeyboardShortcuts,
  KeyboardShortcut,
} from '../../utils/utils';
import { TaskAnswer } from '../task-answer/task-answer';
import { TaskAnswerCorrection } from '../task-answer-correction/task-answer-correction';
import { computePosition, autoUpdate, flip, shift, offset } from '@floating-ui/dom';

@Component({
  tag: 'task-input-multiselect',
  styleUrl: 'task-input-multiselect.css',
  scoped: true,
  formAssociated: true,
})
export class TaskInputMultiselect implements Input {
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


  @Prop() placeholder: string = "Select options"
  options: HTMLTaskInputOptionElement[];
  optionsMap: Map<string, string> = new Map<string, string>();
  @State() values: string[] = [];
  @State() shortcutMap: Map<string, string> = new Map<string, string>();
  @State() optionsDisplayed: boolean
  @Event() registerKeyboardShortcut: EventEmitter<KeyboardShortcut>
  button!: HTMLButtonElement
  optionsDropdown!: HTMLDivElement
  cleanup!: Function
  ro: ResizeObserver

  connectedCallback() {
    InputBase.prototype.connectedCallback.bind(this)()
  }
  formUpdated = InputBase.prototype.formUpdated
  setupDependentInputs = InputBase.prototype.setupDependentInputs
  hasAnswerToValidate = InputBase.prototype.hasAnswerToValidate
  handleParentElementUpdate  = InputBase.prototype.handleParentElementUpdate
  fromInputUpdated = InputBase.prototype.fromInputUpdated.bind(this)
  @Method()
  async validateAgainstAnswer() {return InputBase.prototype.validateAgainstAnswer.bind(this)()}
  @Method()
  async setShowCorrections() {return InputBase.prototype.setShowCorrections.bind(this)()}

  componentWillLoad() {
    InputBase.prototype.componentWillLoad.bind(this)()
    this.options = gatherInputOptions(this.host)
    for (let option of this.options) {
      this.optionsMap[option.value] = option.innerHTML
    }
    for (let ks of inputOptionKeyboardShortcuts(this.options)) {
      this.shortcutMap[ks.keys] = ks.value
      this.registerKeyboardShortcut.emit(ks)
    }
  }

  componentDidLoad() {
    this.button.addEventListener("click", this.handleButtonClick.bind(this))
    document.addEventListener("click", this.handleDocumentClick.bind(this))
    document.addEventListener("blur", this.handleBlur.bind(this), {capture: true})
  }

  disconnectedCallback() {
    InputBase.prototype.displayOnCallback.bind(this)()
    document.removeEventListener("click", this.handleDocumentClick.bind(this))
    document.removeEventListener("blur", this.handleBlur.bind(this), {capture: true})
  }

  handleButtonClick() {
    this.optionsDisplayed = !this.optionsDisplayed
    if (this.optionsDisplayed) {
      this.cleanup = autoUpdate(this.button, this.optionsDropdown, this.updatePosition.bind(this))
    } else if (this.cleanup) {
      this.cleanup()
    }
  }

  handleDocumentClick(event) {
    if (!this.host.contains(event.target)) {
      this.optionsDisplayed = false
    }
  }

  handleBlur(event) {
    if (!this.host.contains(event.target)) {
      this.optionsDisplayed = false
    }
  }

  updatePosition() {
    computePosition(
      this.button,
      this.optionsDropdown,
      {
        placement: "bottom-start",
        middleware: [offset(6), flip(), shift({padding: 5})]
      }).then(({ x, y }) => {
        Object.assign(this.optionsDropdown.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
    })
  }

  handleChange(event: Event) {
    this.values = Array.from((event.target as HTMLSelectElement).selectedOptions).map(v => v.value)
  }

  @Method()
  async readyToSubmit() {
    return Boolean(this.values)
  }

  @Watch("values")
  handleValueUpdate() {
    this.value = this.values.join(",")
    this.inputUpdated.emit(this.input.form)
  }

  handleOptionSelect(e: Event, value: string) {
    e.preventDefault()
    if (this.values.includes(value)) {
      this.values = this.values.filter(v => v !== value)
    } else {
      this.values = [...this.values, value]
    }
  }

  render() {
    return (
      <Host>
        {!this.hidden && <label>
          {this.label}
          <div class="multiselect">
            <div class="selectbar">
              <button type="button" ref={el => this.button = el as HTMLButtonElement}>{this.placeholder}</button>
            </div>
            <div class={"options " + (this.optionsDisplayed ? "" : "options-hidden")} ref={el => this.optionsDropdown = el as HTMLDivElement}>
              <select name={this.name}
                      required={this.required}
                      disabled={this.disabled}
                      onChange={e => this.handleChange(e)}
                      multiple={true}
                      style={{display: "none"}}
                      ref={el => this.input = el}
              >
                {this.options.map(option =>
                  <option
                    value={option.value}
                    selected={this.values.includes(option.value)}
                  >{option.innerHTML}</option>)}
              </select>
              <div class="option-list">
                {this.options.map(option =>
                <div onClick={(e) => this.handleOptionSelect.bind(this)(e, option.value)}>
                  <div tabindex="0" class="item">
                    <task-icon icon={this.values.includes(option.value) ? "small-tick": "blank"}></task-icon>
                    {option.innerHTML}
                  </div>
                </div>)}
              </div>
            </div>
            <div class="selectedvalues">
              {this.values.map(v => <task-tag small={true}>{this.optionsMap[v]}</task-tag>)}
            </div>
          </div>
        </label>}
      </Host>
    )
  }

}
