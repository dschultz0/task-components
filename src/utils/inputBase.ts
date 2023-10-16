import { EventEmitter } from '@stencil/core';
import { getAnswerCorrectionElement, getAnswerElement } from './utils';
import { TaskAnswer } from '../components/task-answer/task-answer';
import { TaskAnswerCorrection } from '../components/task-answer-correction/task-answer-correction';

export type CallbackFunction = (this: Window, ev: Event) => any

export interface Input {
  name: string
  label: string
  labelClass: string
  required: boolean
  active: boolean
  disabled: boolean
  requireIf: string
  requiredIndicator: string
  displayOn: string
  displayIf: string
  value: string
  hidden: boolean
  preventChanges: boolean
  answer: TaskAnswer
  answerCorrection: TaskAnswerCorrection
  inputUpdated: EventEmitter<HTMLElement>
  host: HTMLElement
  input: HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement
  form: HTMLFormElement
  loadCallback: CallbackFunction
  formCallback: CallbackFunction
  displayOnCallback: CallbackFunction

  readyToSubmit(): Promise<boolean>
  validateAgainstAnswer(): Promise<boolean>
  setShowCorrections(value: boolean): Promise<void>
}

export function childInputs(parent: HTMLElement) {
  return (Array.from(parent.querySelectorAll("*")).filter(element => {
    return element.nodeName.startsWith("TASK-INPUT")
      && element.nodeName !== "TASK-INPUT-OPTION"
  }) as unknown[]) as Input[]
  /*.filter(element => {
  return element.parentElement.nodeName !== "TASK-ANSWER" ||
    ((element.parentElement as unknown) as TaskAnswer).displayCorrection
}) as unknown[]) as Input[]*/
}

export function requiredChildInputs(parent: HTMLElement) {
  return childInputs(parent).filter(input => input.required && !input.disabled && !input.hidden)
}

export function inputsWithAnswers() {
  const inputs = Array.from(document.querySelectorAll('*')).filter(element => {
    return element.nodeName.startsWith("TASK-INPUT")
      && element.nodeName !== "TASK-INPUT-OPTION"
      && element.parentElement.nodeName !== "TASK-ANSWER"
  })
  return (inputs.filter(element => {
    return Boolean(element.querySelector("TASK-ANSWER"))
  }) as unknown) as Input[]
}

export function evaluateFormula(formula: string, form: HTMLFormElement) {
  if (formula.includes("=")) {
    const parts = formula.split("=")
    if (parts[0].startsWith("any(")) {
      const inputNames = parts[0].substring(4, parts[0].length-1).split(",")
      const values = inputNames.map(name => form.elements[name.trim()] && form.elements[name.trim()].value)
      const matching = values.filter(v => v === parts[1])
      return matching.length > 0
    }
  }
}

export function getFormElement(host: Element): HTMLFormElement {
  let el: Element = host
  while (el) {
    if (el.tagName === "FORM") {
      return el as HTMLFormElement
    }
    el = el.parentElement
    if (el.tagName === "BODY") {
      return undefined
    }
  }
}

export abstract class InputBase implements Input {

  /***
   Lifecycle methods
   */
  componentWillLoad() {
    this.answer = getAnswerElement(this.host)
    this.answerCorrection = getAnswerCorrectionElement(this.host)
  }
  connectedCallback() {
    this.form = getFormElement(this.host)
    if (this.requireIf || this.displayIf) {
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
  disconnectedCallback() {
    if (this.loadCallback) {
      document.removeEventListener("load", this.loadCallback)
    }
    if (this.formCallback) {
      this.form.removeEventListener("input", this.formCallback)
    }
    if (this.displayOnCallback) {
      this.host.parentElement.removeEventListener("inputUpdated", this.displayOnCallback)
    }
  }
  formUpdated() {
    if (this.form) {
      if (this.requireIf) {
        const result = evaluateFormula(this.requireIf, this.form)
        if (result !== undefined) {
          this.required = result
        }
      }
      if (this.displayIf) {
        const result = evaluateFormula(this.displayIf, this.form)
        if (result !== undefined) {
          const previous = this.hidden
          this.hidden = !result
          if (this.hidden !== previous) {
            this.inputUpdated.emit(this.form)
          }
        }
      }
    }
  }

  setupDependentInputs() {
    if ((this.requireIf || this.displayIf) && this.form) {
      this.formCallback = this.formUpdated.bind(this)
      this.form.addEventListener('input', this.formCallback)
      this.formUpdated()
    }
  }

  handleParentElementUpdate() {
    const parent = (this.host.parentElement as unknown) as Input
    const previous = this.hidden
    this.hidden = parent.value !== this.displayOn || parent.hidden
    if (this.hidden !== previous) {
      this.inputUpdated.emit(this.form)
    }
  }

  hasAnswerToValidate = () => {
    return this.answer && this.answerCorrection && this.answerCorrection.displayOn === "submit"
  }

  //@Method()
  async readyToSubmit() {
    return Boolean(this.value)
  }

  //Method()
  async validateAgainstAnswer() {
    return !(this.hasAnswerToValidate() && this.value !== this.answer.value)
  }

  //@Method()
  async setShowCorrections(value: boolean) {
    if (this.hasAnswerToValidate()) {
      this.preventChanges = this.answerCorrection.preventChanges && value
      if (this.value !== this.answer.value) {
        this.answerCorrection.displayCorrection = value
        if (value) {
          this.inputUpdated.emit(this.form)
        }
      }
    }
  }

  //@Watch("value")
  //@Watch("required")
  handleValueUpdate(_value: string) {
    this.inputUpdated.emit(this.form)
  }

  active: boolean;
  answer: TaskAnswer;
  answerCorrection: TaskAnswerCorrection;
  disabled: boolean;
  displayOn: string;
  displayIf: string;
  hidden: boolean;
  host: HTMLElement;
  input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  form: HTMLFormElement
  inputUpdated: EventEmitter<HTMLElement>;
  label: string;
  labelClass: string;
  name: string;
  preventChanges: boolean;
  requireIf: string;
  required: boolean;
  requiredIndicator: string;
  value: string;
  displayOnCallback(_ev: Event): any {}
  formCallback(_ev: Event): any {}
  loadCallback(_ev: Event): any {}
}
