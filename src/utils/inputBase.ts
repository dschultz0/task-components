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
  disableIf: string
  requireIf: string
  requiredIndicator: string
  displayOn: string
  displayIf: string
  value: string
  valueFrom: string
  hidden: boolean
  preventChanges: boolean
  answer: TaskAnswer
  answerCorrection: TaskAnswerCorrection
  inputUpdated: EventEmitter<HTMLElement>
  host: HTMLElement
  input: HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement
  fromInput: InputEventTarget;
  form: HTMLFormElement
  loadCallback: CallbackFunction
  formCallback: CallbackFunction
  displayOnCallback: CallbackFunction
  fromInputUpdated: CallbackFunction

  readyToSubmit(): Promise<boolean>
  validateAgainstAnswer(): Promise<boolean>
  setShowCorrections(value: boolean): Promise<void>
}

export type InputEventTarget = Input & EventTarget

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
  const operators = ["=", " in ", " IN ", " In ", "!=", "<=", ">=", "<", ">"]
  let operator = null
  let parts = null
  let not = false
  let any = false
  if (formula.startsWith("not(") && formula.endsWith(")")) {
    not = true
    formula = formula.substring(4, formula.length - 1)
  }
  for (let op of operators) {
    if (formula.includes(op)) {
      operator = op.toLowerCase().trim()
      parts = formula.split(op).map(p => p.trim())
      break
    }
  }
  if (parts) {
    const inputNames = getFormulaInputNames(parts[0])
    any = inputNames.length > 1 && parts[0].startsWith("any")
    const values = inputNames.map(name => form.elements[name] && form.elements[name].value)
    const evaluation = evaluateOperator(operator, values, parts[1])
    const success = evaluation.filter(e => e)
    const evalTrue = success.length === inputNames.length || (any && success.length > 0)
    return (evalTrue && !not) || (!evalTrue && not)
  }
}

function evaluateOperator(op: string, values: string[], formulaSuffix: string) {
  switch (op) {
    case "=":
      return values.map(v => v === formulaSuffix)
    case "!=":
      return values.map(v => v !== formulaSuffix)
    case ">":
      return values.map(v => parseFloat(v) > parseFloat(formulaSuffix))
    case ">=":
      return values.map(v => parseFloat(v) >= parseFloat(formulaSuffix))
    case "<":
      return values.map(v => parseFloat(v) < parseFloat(formulaSuffix))
    case "<=":
      return values.map(v => parseFloat(v) <= parseFloat(formulaSuffix))
    case "in":
      if (formulaSuffix.startsWith("[") && formulaSuffix.endsWith("]")) {
        formulaSuffix = formulaSuffix.substring(1, formulaSuffix.length - 1)
        const options = formulaSuffix.split(",").map(o => trimQuotes(o.trim()))
        return values.map(v => options.includes(v))
      } else {
        return []
      }
  }
}

function trimQuotes(value: string): string {
  if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
    return value.substring(1, value.length - 1)
  } else {
    return value
  }
}

function getFormulaInputNames(formulaPrefix: string): string[] {
  const functions = ["any", "all"]
  for (let f of functions) {
    if (formulaPrefix.startsWith(f)) {
      return formulaPrefix.substring(4, formulaPrefix.length-1).split(",").map(i => i.trim())
    }
  }
  return [formulaPrefix]
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

export function findInput(name: string): Promise<InputEventTarget> {
  return new Promise(resolve => {
    const input = document.querySelector(`[name='${name}']`)
    if (input) {
      resolve((input as unknown) as InputEventTarget)
    } else {
      setTimeout(() => resolve(findInput(name)), 1000)
    }
  })
}

export function attachInputListener(name: string, callback: CallbackFunction, type="inputUpdated"): Promise<InputEventTarget> {
  return findInput(name).then((input: InputEventTarget) => {
    input.addEventListener(type, callback)
    return input
  })
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
    if (this.requireIf || this.displayIf || this.valueFrom) {
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
    if (this.fromInput && this.fromInputUpdated) {
      // this.fromInput.removeEventListener("inputUpdated", this.fromInputUpdated)
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
    if (this.valueFrom) {
      attachInputListener(this.valueFrom, this.fromInputUpdated)
        .then(input => {
          this.fromInput = input
          this.fromInputUpdated()
        })
    }
  }

  fromInputUpdated() {
    if (this.fromInput) {
      this.value = this.fromInput.value
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
  disableIf: string;
  displayOn: string;
  displayIf: string;
  hidden: boolean;
  host: HTMLElement;
  input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  fromInput: InputEventTarget;
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
  valueFrom: string;
  displayOnCallback(_ev: Event): any {}
  formCallback(_ev: Event): any {}
  loadCallback(_ev: Event): any {}
}
