import { Component, Prop, h, State, Watch, Listen } from '@stencil/core';

@Component({
  tag: 'task-instructions',
  styleUrl: 'task-instructions.css',
  shadow: true,
})
export class TaskInstructions {
  @Prop() tab: string = "Instructions"
  @Prop() header: string = "Task Instructions"

  @State() open: boolean = false
  @State() visible: boolean = false
  @State() active: boolean = false

  tabClicked() {
    this.open = !this.open
  }

  @Watch("open")
  updateActiveVisible(newValue: boolean) {
    if (newValue) {
      this.active = true
      document.documentElement.style.overflow = 'hidden';
      setTimeout(() => this.visible = true, 50)
    } else {
      this.visible = false
      document.documentElement.style.overflow = ''
      setTimeout(() => this.active = false, 350)
    }
  }

  @Listen('keydown')
  handleKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      this.open = false
    }
  }

  /*
  Remaining work:
  * The padding and scroll on the content is a bit messed up
  * Make the tab button a functional component with its own listener that captures
    the click so it isn't transmitted to the tab bar, then add a close listener to the tabbar
  * Option for left and right
  * Option to set width
  * option to set tab color
  * Option to insert images
   */
  render() {
    return (
      <div
        class={"drawer" + (this.visible ? " is-visible" : "") + (this.active ? " is-active" : "")}
        tabindex="0"
      >
        <div class="overlay" tabindex="-1" onClick={() => this.open = false}></div>
        <div class="wrapper">
          <div class="tabbar">
            <div class="tab" onClick={() => this.tabClicked()}>
              <div>{this.tab}</div>
            </div>
          </div>
          <div class="body">
            <div class="header">
              <div class="title">{this.header}</div>
              <button class="close" onClick={() => this.open = false}></button>
            </div>
            <div class="content">
              <div class="contentSlot">
                <slot></slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
