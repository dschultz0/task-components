import { Component, Host, h, Prop } from '@stencil/core';
import icons from './icons'
import classNames from 'classnames';

const STANDARD = 16
const LARGE = 20

@Component({
  tag: 'task-icon',
  styleUrl: 'task-icon.css',
  scoped: true,
})
export class TaskIcon {
  @Prop() icon: string = "blank"
  @Prop() size: number = STANDARD

  iconSVG() {
    const pathSize = this.size < LARGE ? STANDARD : LARGE
    return <svg
      data-icon={this.icon}
      height={this.size}
      width={this.size}
      role="img"
      viewBox={`0 0 ${pathSize} ${pathSize}`}
      >
      {icons[this.icon][pathSize].map(p => <path d={p} fill-rule="evenodd"></path>)}
    </svg>
  }

  iconFont() {
    const sizeClass = this.size < LARGE ? "icon-standard" : "icon-large"
    const classes = classNames(sizeClass, `icon-${this.icon}`)
    let style = {}
    if (![16,20].includes(this.size)) {
      const size = `${this.size}px`
      style = {
        "font-size": size,
        height: size,
        width: size
      }
    }
    return <span class={classes} style={style}></span>
  }

  render() {
    return (
      // TODO: Figure out why this size override is necessary
      <Host class="icon" style={{height: `${this.size}px`}}>
        {this.icon in icons ? this.iconSVG() : this.iconFont()}
      </Host>
    );
  }
}
