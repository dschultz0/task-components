import { Component, Host, h, Listen, Element, Prop, State, Watch } from '@stencil/core';
import {TaskProgressbar} from '../task-progressbar/task-progressbar';
import {TaskSubmit} from '../task-submit/task-submit';
import { KeyboardShortcut, childInputs, inputsWithAnswers } from '../../utils/utils';
import {TaskKeyboardShortcutList} from '../task-keyboard-shortcut-list/task-keyboard-shortcut-list';
import {context} from '../../utils/context'

@Component({
  tag: 'task-body',
  styleUrl: 'task-body.css',
  shadow: true,
})
export class TaskBody {
  @Prop() saveLocal: boolean = false
  @Prop() localId: string
  @State() showCorrections: boolean = false
  @Element() host
  formElement: HTMLFormElement
  previous: any

  componentWillLoad() {
    if (this.saveLocal) {
      this.previous = JSON.parse(localStorage.getItem(this.localStorageId()))
      if (this.previous && "showCorrections" in this.previous) {
        this.showCorrections = Boolean(this.previous.showCorrections)
      }
    }
  }

  componentDidLoad() {
    this.hideUnnecessaryCrowdFormSubmit()
    if (this.previous) {
      for (let input of childInputs(this.host)) {
        if (input.name in this.previous) {
          input.setValue(this.previous[input.name])
        }
      }
    }
    this.formElement = document.querySelector("form")
  }

  hideUnnecessaryCrowdFormSubmit() {
    /*
    Crowd HTML Elements will add a submit button if it doesn't detect one in your template.
    Unfortunately, if it loads before Task Components, then it will add one, even if Task Components
    will be adding one later. This checks for its presence and hides it.
     */
    const submitButtons = document.getElementsByTagName("task-submit")
    if (submitButtons.length > 0) {
      const els = document.getElementsByTagName("crowd-button")
      for (let el of els) {
        if (el.hasAttribute("form-action") &&
          el.getAttribute("form-action") === "submit") {
          (el as HTMLElement).style.display = "none"
        }
      }
    }
  }

  localStorageId = () => {
    // TODO: Figure out what the default id should be for smgt
    if (this.localId) {
      return this.localId
    } else {
      if (context.mode !== "working") {
        return "PREVIEW"
      } else {
        return context.assignmentId
      }
    }
  }

  @Listen("inputUpdated")
  handleInputUpdated(event: CustomEvent<HTMLFormElement>) {
    // small delay to allow time for the value to propagate to the input
    if (this.saveLocal) {
      setTimeout(() => this.writeFormData(event.detail), 500)
    }
  }

  writeFormData(form?: HTMLFormElement) {
    console.log(form)
    console.log(this.formElement)
    let f = form || this.formElement
    if (f) {
      const formData = new FormData(form)
      const data = Object.fromEntries(formData.entries())
      data.showCorrections = String(this.showCorrections)
      localStorage.setItem(this.localStorageId(), JSON.stringify(data))
    }
  }

  @Listen("showCorrections")
  handleShowCorrections() {
    this.showCorrections = true
    if (this.saveLocal) {
      this.writeFormData()
    }
  }

  @Watch("showCorrections")
  handleShowCorrectionsUpdated(value: boolean) {
    for (let input of inputsWithAnswers()) {
      input.setShowCorrections(value)
    }
    const submitButtons = document.getElementsByTagName("task-submit")
    for (let button of submitButtons) {
      ((button as unknown) as TaskSubmit).setShowCorrections(value)
    }
  }

  @Listen("taskSubmit")
  handleTaskSubmit() {
    if (this.saveLocal) {
      localStorage.removeItem(this.localStorageId())
    }
  }

  @Listen("cardReadyToSubmit")
  cardReadyToSubmitHandler() {
    const progressBars = (this.host as Element).querySelectorAll("TASK-PROGRESSBAR")
    for (let bar of Array.from(progressBars)) {
      ((bar as unknown) as TaskProgressbar).refreshProgress()
    }
    const submitButtons = (this.host as Element).querySelectorAll("TASK-SUBMIT")
    for (let button of Array.from(submitButtons)) {
      ((button as unknown) as TaskSubmit).refreshSubmitReady()
    }
  }

  @Listen("registerKeyboardShortcut")
  registerKeyboardShortcutHandler(event: CustomEvent<KeyboardShortcut>) {
    const shortcutLists = (this.host as Element).querySelectorAll("TASK-KEYBOARD-SHORTCUT-LIST")
    for (let list of Array.from(shortcutLists)) {
      ((list as unknown) as TaskKeyboardShortcutList).addShortCut(event.detail)
    }
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
