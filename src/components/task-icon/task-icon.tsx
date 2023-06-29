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
