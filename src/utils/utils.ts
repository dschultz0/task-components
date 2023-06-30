import { TaskAnswer } from '../components/task-answer/task-answer';
import { TaskAnswerCorrection } from '../components/task-answer-correction/task-answer-correction';

export function format(first: string, middle: string, last: string): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}

export function ignoreKeypress(): boolean {
  // TODO: Also need to add input text field as well
  return document.activeElement.nodeName === "TEXTAREA"
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
  return childInputs(parent).filter(input => input.required && !input.disabled)
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

export interface Input {
  name: string
  readyToSubmit(): Promise<boolean>
  validateAgainstAnswer(): Promise<boolean>
  required: boolean
  active: boolean
  disabled: boolean
}

export type KeyboardShortcut = {
  label: string
  keys: string
  value?: string
}

export type InputOption = {
  value: string;
  innerHTML: string;
  keyboardShortcut?: string;
}

export function gatherInputOptions(parent: HTMLElement) {
  const options: InputOption[] = []
  for (let child of Array.from(parent.children)) {
    if (child.nodeName === "TASK-INPUT-OPTION") {
      const value = child.attributes.getNamedItem("value")
      const shortcut = child.attributes.getNamedItem("keyboard-shortcut")
      const option: InputOption = {value: value ? value.value : null, innerHTML: child.innerHTML}
      if (shortcut) {
        option.keyboardShortcut = shortcut.value
      }
      options.push(option)
    }
  }
  return options
}

export function inputOptionKeyboardShortcuts(options: InputOption[]): KeyboardShortcut[] {
  const shortcuts: KeyboardShortcut[] = []
  for (let option of options) {
    if (option.keyboardShortcut) {
      shortcuts.push({label: option.innerHTML, keys: option.keyboardShortcut, value: option.value})
    }
  }
  return shortcuts
}

export function getAnswerElement(host: Element) {
  return (host.querySelector("TASK-ANSWER") as unknown) as TaskAnswer
}
export function getAnswerCorrectionElement(host: Element) {
  return (host.querySelector("TASK-ANSWER-CORRECTION") as unknown) as TaskAnswerCorrection
}
