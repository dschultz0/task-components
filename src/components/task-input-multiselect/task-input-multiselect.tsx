import { Component, Host, h, Prop, Element, State, Event, EventEmitter, Method, Watch } from '@stencil/core';
import {
  gatherInputOptions, getAnswerCorrectionElement, getAnswerElement,
  Input,
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
})
export class TaskInputMultiselect implements Input {
  @Prop() name: string;
  @Prop() required: boolean;
  @Prop() label: string;
  @Prop() active: boolean = true;
  @Prop() disabled: boolean = false;
  @Prop() placeholder: string = "Select options"
  @Element() host: HTMLElement;
  @State() options: HTMLTaskInputOptionElement[];
  @State() optionsMap: Map<string, string> = new Map<string, string>();
  @State() value: string
  @State() values: string[] = [];
  @State() shortcutMap: Map<string, string> = new Map<string, string>();
  @State() answer: TaskAnswer
  @State() answerCorrection: TaskAnswerCorrection
  @State() preventChanges: boolean
  @State() optionsDisplayed: boolean
  @Event() inputUpdated: EventEmitter<HTMLElement>
  @Event() registerKeyboardShortcut: EventEmitter<KeyboardShortcut>
  button!: HTMLButtonElement
  optionsDropdown!: HTMLDivElement
  input!: HTMLSelectElement
  cleanup!: Function
  ro: ResizeObserver

  componentWillLoad() {
    this.options = gatherInputOptions(this.host)
    for (let option of this.options) {
      this.optionsMap[option.value] = option.innerHTML
    }
    for (let ks of inputOptionKeyboardShortcuts(this.options)) {
      this.shortcutMap[ks.keys] = ks.value
      this.registerKeyboardShortcut.emit(ks)
    }
    this.answer = getAnswerElement(this.host)
    this.answerCorrection = getAnswerCorrectionElement(this.host)
  }

  componentDidLoad() {
    this.button.addEventListener("click", this.handleButtonClick.bind(this))
    document.addEventListener("click", this.handleDocumentClick.bind(this))
    document.addEventListener("blur", this.handleBlur.bind(this), {capture: true})
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

  disconnectedCallback() {
    document.removeEventListener("click", this.handleDocumentClick.bind(this))
    document.removeEventListener("blur", this.handleBlur.bind(this), {capture: true})
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
        <label>
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
        </label>
      </Host>
    )
  }

}
