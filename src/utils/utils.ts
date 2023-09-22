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
  setValue(value: string): Promise<void>
  getValue(): Promise<string>
  setShowCorrections(value: boolean): Promise<void>
  required: boolean
  active: boolean
  disabled: boolean
}

export type KeyboardShortcut = {
  label: string
  keys: string
  value?: string
}

export function gatherInputOptions(parent: HTMLElement) {
  return Array.from(parent.getElementsByTagName("task-input-option"))
    .filter(n => Array.from(parent.children).includes(n))
}

export function inputOptionKeyboardShortcuts(options: HTMLTaskInputOptionElement[]): KeyboardShortcut[] {
  const shortcuts: KeyboardShortcut[] = []
  for (let option of options) {
    if (option.keyboardShortcut) {
      if (option.keyboardShortcutLabel) {
        shortcuts.push({label: option.keyboardShortcutLabel, keys: option.keyboardShortcut, value: option.value})
      } else {
        shortcuts.push({label: option.innerHTML, keys: option.keyboardShortcut, value: option.value})
      }
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

export function getActiveElement(element?: HTMLElement | null, options?: GetRootNodeOptions) {
  if (element == null) {
    return document.activeElement
  }
  const rootNode = (element.getRootNode(options) ?? document) as DocumentOrShadowRoot & Node;
  return rootNode.activeElement
}

export function isFunction(value: any): value is Function {
  return typeof value === "function"
}

export function isKeyboardClick(event: KeyboardEvent) {
  return event.key === "Enter" || event.key === " "
}

export function isArrowKey(event: KeyboardEvent) {
  return ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(event.key) >= 0
}
