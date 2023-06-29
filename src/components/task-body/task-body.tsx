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
