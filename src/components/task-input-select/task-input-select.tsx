import { Component, Host, h, Prop, Element, State, Event, EventEmitter, Method, Watch } from '@stencil/core';
import {
  gatherInputOptions,
  Input,
  InputOption,
  inputOptionKeyboardShortcuts,
  KeyboardShortcut,
} from '../../utils/utils';
import { TaskAnswer } from '../task-answer/task-answer';

@Component({
  tag: 'task-input-select',
  styleUrl: 'task-input-select.css',
  scoped: true,
})
export class TaskInputSelect implements Input {
  @Prop() name: string;
  @Prop() required: boolean;
  @Prop() label: string;
  @Prop() active: boolean = true;
  @Prop() disabled: boolean = false;
  @Element() host: HTMLElement;
  @State() options: Array<InputOption> = [];
  @State() value: string;
  @State() shortcutMap: Map<string, string> = new Map<string, string>();
  @State() answer: string
  @State() preventChanges: boolean
  @Event() inputUpdated: EventEmitter<HTMLElement>
  @Event() registerKeyboardShortcut: EventEmitter<KeyboardShortcut>

  componentWillLoad() {
    this.options = gatherInputOptions(this.host)
    for (let ks of inputOptionKeyboardShortcuts(this.options)) {
      this.shortcutMap[ks.keys] = ks.value
      this.registerKeyboardShortcut.emit(ks)
    }
  }

  handleChange(event: Event) {
    this.value = (event.target as HTMLInputElement).value
  }

  @Method()
  async readyToSubmit() {
    return Boolean(this.value)
  }

  @Method()
  async validateAgainstAnswer() {
    const answer = ((this.host.querySelector("TASK-ANSWER") as unknown) as TaskAnswer)
    if (answer.preventChanges) {
      this.preventChanges = true
    }
    if (this.value !== answer.value) {
      console.log("mismatch")
      answer.displayCorrection = true
      if (answer.showAnswer) {
        this.answer = answer.value
      }
      this.inputUpdated.emit(this.host)
      return false
    } else {
      return true
    }
  }

  @Watch("value")
  handleValueUpdate() {
    this.inputUpdated.emit(this.host)
  }

  render() {
    return (
      <Host>
        <label>
          {this.label}
          <div class="select">
            <select name={this.name} required={this.required} disabled={this.disabled} onChange={e => this.handleChange(e)}>
              {this.options.map(option =>
                <option
                  value={option.value}
                  selected={option.value === this.value}
                >{option.innerHTML}</option>)}
            </select>
          </div>
        </label>
      </Host>
    )
  }

}
