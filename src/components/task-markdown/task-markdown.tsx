import { Component, h, Prop, State, Element } from '@stencil/core'
import {parse} from 'marked'

@Component({
  tag: 'task-markdown',
  styleUrl: 'task-markdown.css',
  shadow: true,
})
export class TaskMarkdown {
  @Element() host: HTMLElement
  @Prop() markdown_url: string
  @State() markdownHTML: string
  @State() children: Array<any> = [];

  componentWillLoad() {
    const assetMap: Map<string, string> = new Map()
    let child: Element
    for (child of Array.from(this.host.children)) {
      if (child.tagName === "TASK-ASSET") {
        assetMap.set(child.getAttribute("asset"), child.getAttribute("value"))
      }
    }
    fetch(this.markdown_url, {
      method: 'GET', cache: "no-cache"
    }).then(response => response.text())
      .then(response => {
        let html: string = parse(response)
        assetMap.forEach((value: string, key: string) => {
          html = html.replace(key, value)
        })
        this.markdownHTML = html
      })
  }

  render() {
    return (
      <div class="content" innerHTML={this.markdownHTML}></div>
    )
  }

}
