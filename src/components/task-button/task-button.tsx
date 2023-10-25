import { Component, Host, Fragment, h, Prop, EventEmitter, Event, State, Element } from '@stencil/core';
import classNames from 'classnames'
import { isKeyboardClick } from '../../utils/utils';

@Component({
  tag: 'task-button',
  styleUrl: 'task-button.css',
  scoped: false,
})
export class TaskButton {
  @Prop() anchor: boolean = false
  @Prop() label: boolean = false
  @Prop() active: boolean = false
  @Prop() alignText: string = "center"
  @Prop() disabled: boolean = false
  @Prop() fill: boolean = false
  @Prop() large: boolean = false
  @Prop() small: boolean = false
  @Prop() loading: boolean = false
  @Prop() type: string = "button"
  @Prop() intent: string
  @Prop() selected: boolean = false
  @Prop() minimal: boolean = false
  @Prop() outlined: boolean = false
  @Prop() text: string
  @Prop() icon: string
  @Prop() iconSize: number
  @Prop() rightIcon: string
  @Prop() href: string
  @Prop() target: string
  @Prop() newWindow: boolean = false
  @Prop() tabindex: string
  @State() isActive: boolean = false
  @State() currentKeyPressed: string
  @Event() click: EventEmitter
  @Event() focus: EventEmitter
  @Element() host: HTMLElement
  button?: HTMLAnchorElement|HTMLButtonElement


  handleBlur() {
      if (this.isActive) {
          this.isActive = false
      }
  }
  handleKeyDown(e: KeyboardEvent) {
      if (isKeyboardClick(e)) {
          e.preventDefault()
          if (e.key !== this.currentKeyPressed) {
             this.isActive = true
          }
      }
      this.currentKeyPressed = e.key
      //props.onKeyDown?.(e)
  }
  handleKeyUp(e: KeyboardEvent) {
      if (isKeyboardClick(e)) {
          this.isActive = false
          this.button?.click()
      }
      this.currentKeyPressed = undefined
      //props.onKeyUp?.(e);
  }

  renderContents() {
    return <Fragment>
      {this.loading && <task-spinner key="loading" class="button-spinner" size="small"></task-spinner>}
      {this.icon && <task-icon key="leftIcon" icon={this.icon} size={this.iconSize}></task-icon>}
      <span key="text" class="button-text">
        {this.text}
        <slot></slot>
      </span>
      {this.rightIcon && <task-icon key="rightIcon" icon={this.rightIcon} size={this.iconSize}></task-icon>}
    </Fragment>
  }

  render() {
    const disabled = this.disabled || this.loading
    const classes = classNames(
      "button",
      {
        ["active"]: !disabled && (this.active || this.isActive),
        ["disabled"]: disabled,
        ["fill"]: this.fill,
        ["large"]: this.large,
        ["loading"]: this.loading,
        ["minimal"]: this.minimal,
        ["outlined"]: this.outlined,
        ["small"]: this.small,
        [`intent-${this.intent}`]: this.intent,
        ["selected"]: this.selected,
      },
      this.alignText ? `align-${this.alignText}` : undefined
    )
    return (
      <Host>
        {this.anchor ?
          <a
            key="anchorButton"
            href={this.href}
            class={classes}
            target={this.newWindow ? "_blank" : this.target}
            ref={el => this.button = el as HTMLAnchorElement}
            onBlur={() => this.handleBlur()}
            onKeyDown={e => this.handleKeyDown(e)}
            onKeyUp={e => this.handleKeyUp(e)}
            tabindex={disabled ? -1 : this.tabindex}
          >
            {this.renderContents()}
          </a>
          : (this.label ?
            <label class={classes}>
              {this.renderContents()}
            </label>
            :
          <button
            key="button"
            type={this.type}
            class={classes}
            disabled={disabled}
            ref={el => this.button = el as HTMLButtonElement}
            onBlur={() => this.handleBlur()}
            onKeyDown={e => this.handleKeyDown(e)}
            onKeyUp={e => this.handleKeyUp(e)}
            tabindex={disabled ? -1 : this.tabindex}
          >
            {this.renderContents()}
          </button>)
        }
      </Host>
    );
  }

}
