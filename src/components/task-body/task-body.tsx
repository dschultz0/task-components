import { Component, Host, h, Listen, Element } from '@stencil/core';
import {TaskProgressbar} from '../task-progressbar/task-progressbar';
import {TaskSubmit} from '../task-submit/task-submit';
import {KeyboardShortcut} from '../../utils/utils';
import {TaskKeyboardShortcutList} from '../task-keyboard-shortcut-list/task-keyboard-shortcut-list';

@Component({
  tag: 'task-body',
  styleUrl: 'task-body.css',
  shadow: true,
})
export class TaskBody {
  @Element() host;

  componentDidLoad() {
    this.hideUnnecessaryCrowdFormSubmit()
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
