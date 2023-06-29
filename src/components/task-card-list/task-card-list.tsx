import { Component, Host, h, Prop, State, Listen, Element, Event, EventEmitter } from '@stencil/core';
import { TaskCard } from '../task-card/task-card';
import { ignoreKeypress, KeyboardShortcut } from '../../utils/utils';

@Component({
  tag: 'task-card-list',
  styleUrl: 'task-card-list.css',
  scoped: true,
})
export class TaskCardList {
  @Prop() backKeyboardShortcut: string;
  @Prop() forwardKeyboardShortcut: string;
  @Prop() advanceWhenComplete: boolean = true;
  @Element() host: HTMLDivElement
  @State() cards: Element[]
  @State() active: number = 0
  @Event() registerKeyboardShortcut: EventEmitter<KeyboardShortcut>

  componentWillLoad() {
    this.cards = Array.from(this.host.children).filter(node => node.nodeName === "TASK-CARD")
    if (this.cards.length > this.active) {
      this.cards[this.active]["active"] = true
    }
    if (this.backKeyboardShortcut) {
      this.registerKeyboardShortcut.emit(
        {label: "Move Left", keys: this.backKeyboardShortcut}
      )
    }
    if (this.forwardKeyboardShortcut) {
      this.registerKeyboardShortcut.emit(
        {label: "Move Right", keys: this.forwardKeyboardShortcut}
      )
    }
  }

  scrollIntoView(cardIndex: number ) {
    this.cards[cardIndex].scrollIntoView({ behavior: "smooth", block: "end" })
  }

  @Listen("keydown", { target: "document" })
  keypressHandler(event: KeyboardEvent) {
    if (!ignoreKeypress()) {
      if (this.backKeyboardShortcut && this.backKeyboardShortcut.split(",").includes(event.key)) {
        this.active = Math.max(this.active - 1, 0)
        this.scrollIntoView(this.active)
      } else if (this.forwardKeyboardShortcut && this.forwardKeyboardShortcut.split(",").includes(event.key)) {
        this.active = Math.min(this.active + 1, this.cards.length - 1)
        this.scrollIntoView(this.active)
      }
    }
  }

  @Listen("cardClicked")
  cardClickedHandler(event: CustomEvent<TaskCard>) {
    if (this.cards.includes(event.target as Element)) {
      this.active = this.cards.indexOf(event.target as Element)
    }
  }

  @Listen("cardReadyToSubmit")
  cardReadyToSubmitHandler(event: CustomEvent<boolean>) {
    if (event.detail) {
      this.active = Math.min(this.active + 1, this.cards.length - 1)
      this.scrollIntoView(this.active)
    }
  }

  render() {
    for (let i = 0; i < this.cards.length; i++) {
      this.cards[i]["active"] = i === this.active
    }
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
