import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'task-icon',
  styleUrl: 'task-icon.css',
  scoped: true,
})
export class TaskIcon {
  @Prop() icon: string

  iconSVG() {
    switch(this.icon) {
      case "blank":
        return <svg data-icon="blank" height="16" role="img" viewBox="0 0 16 16" width="16"></svg>
      case "small-tick":
        return <svg data-icon="small-tick" height="16" role="img" viewBox="0 0 16 16" width="16"><path d="M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z" fill-rule="evenodd"></path></svg>
      case "caret-down":
        return <svg data-icon="caret-" height="16" role="img" viewBox="0 0 16 16" width="16"><path d="M12 6.5c0-.28-.22-.5-.5-.5h-7a.495.495 0 00-.37.83l3.5 4c.09.1.22.17.37.17s.28-.07.37-.17l3.5-4c.08-.09.13-.2.13-.33z" fill-rule="evenodd"></path></svg>
      case "caret-left":
        return <svg data-icon="caret-" height="16" role="img" viewBox="0 0 16 16" width="16"><path d="M9.5 4c-.13 0-.24.05-.33.13l-4 3.5c-.1.09-.17.22-.17.37s.07.28.17.37l4 3.5a.495.495 0 00.83-.37v-7c0-.28-.22-.5-.5-.5z" fill-rule="evenodd"></path></svg>
      case "caret-right":
        return <svg data-icon="caret-" height="16" role="img" viewBox="0 0 16 16" width="16"><path d="M11 8c0-.15-.07-.28-.17-.37l-4-3.5A.495.495 0 006 4.5v7a.495.495 0 00.83.37l4-3.5c.1-.09.17-.22.17-.37z" fill-rule="evenodd"></path></svg>
      case "caret-up":
        return <svg data-icon="caret-" height="16" role="img" viewBox="0 0 16 16" width="16"><path d="M11.87 9.17s.01 0 0 0l-3.5-4C8.28 5.07 8.15 5 8 5s-.28.07-.37.17l-3.5 4a.495.495 0 00.37.83h7a.495.495 0 00.37-.83z" fill-rule="evenodd"></path></svg>
    }
  }
  render() {
    return (
      <Host>
        {this.iconSVG()}
      </Host>
    );
  }

}
