import { Component, Host, h, Method, State, Element, Fragment } from '@stencil/core';
import { KeyboardShortcut } from '../../utils/utils';

@Component({
  tag: 'task-keyboard-shortcut-list',
  styleUrl: 'task-keyboard-shortcut-list.css',
  scoped: true,
})
export class TaskKeyboardShortcutList {
  @State() shortcuts: Map<string, KeyboardShortcut> = new Map<string, KeyboardShortcut>()
  @Element() host: HTMLElement

  componentWillLoad() {
    for (let child of Array.from(this.host.children)) {
      if (child.nodeName === "TASK-KEYBOARD-SHORTCUT") {
        this.addShortCut({
          label: child.innerHTML,
          keys: child.attributes.getNamedItem("keyboard-shortcut").value
        })
      }
    }
  }

  @Method()
  async addShortCut(shortcut: KeyboardShortcut) {
    this.shortcuts = new Map(this.shortcuts.set(shortcut.label, shortcut))
  }

  valueMap = {
    "ArrowLeft": "Left Arrow",
    "ArrowRight": "Right Arrow",
    "tab": "Tab"
  }

  formatKey(key: string) {
    if (key in this.valueMap) {
      return this.valueMap[key]
    } else if (key.length === 1) {
      return key.toUpperCase()
    } else {
      return key
    }
  }

  renderRow(ks: KeyboardShortcut) {
    const keys = ks.keys.split(",")
    return (
      <div class="hotkey">
        <div class="hotkey-label">{ks.label}</div>
        {keys.length > 1 ?
          <span class="key-combo">
            {keys.map((k, i) =>
            <Fragment>
              <kbd class="key">{this.formatKey(k)}</kbd>{i < keys.length - 1 && <span> or </span>}
            </Fragment>
            )}</span>
          : <kbd class="key">{this.formatKey(keys[0])}</kbd>}
      </div>
    )
  }

  render() {
    return (
      <Host>
        {Array.from(this.shortcuts.values()).map((ks) => this.renderRow(ks))}
      </Host>
    );
  }

}
