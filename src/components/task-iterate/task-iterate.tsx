import { Component, Host, h, Prop, Element } from '@stencil/core';

@Component({
  tag: 'task-iterate',
  styleUrl: 'task-iterate.css',
  scoped: true,
})
export class TaskIterate {
  @Prop() values: string
  @Element() host: HTMLElement
  elementChildren: HTMLCollection
  valueList: string[]
  innerHTML: string

  private parsedValues() {
    try {
      return JSON.parse(this.values)
    } catch (Exception) {
      const values = this.values.replace("[", "").replace("]", "")
      return values.split(",").map(v => v.trim())
    }
  }

  componentWillLoad() {
    this.valueList = this.parsedValues()
    this.elementChildren = this.host.children
    if (this.elementChildren.length == 1 && "sc-task-iterate" in this.elementChildren.item(0).classList) {
      this.elementChildren = this.elementChildren.item(0).children
    }
    this.innerHTML = this.host.innerHTML
  }

  renderChild(value, index) {
    return <div key={`iter${index}`} data-iterator={value} innerHTML={this.innerHTML} class="child-container"></div>
  }

  render() {
    return (
      <Host>
        {this.valueList.map((value, index) => this.renderChild(value, index))}
        <div style={{display: "none"}}>
          <slot></slot>
        </div>
      </Host>
    );
  }

}
