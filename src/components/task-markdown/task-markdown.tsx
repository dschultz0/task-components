import { Component, h, Prop, State } from '@stencil/core'
import {parse} from 'marked'

@Component({
  tag: 'task-markdown',
  styleUrl: 'task-markdown.css',
  shadow: true,
})
export class TaskMarkdown {
  @Prop() markdown_url: string
  @State() markdownHTML: string
  contentDiv!: HTMLDivElement

  componentWillLoad() {
    return fetch(this.markdown_url, {
      method: 'GET'
    }).then(response => response.text())
      .then(response => this.markdownHTML = parse(response))
      .then(() => console.log(this.markdownHTML))
  }

  componentDidRender() {
    this.contentDiv.innerHTML = this.markdownHTML
  }
  render() {
    return (
      <div class="content" ref={el => this.contentDiv = el as HTMLDivElement}></div>
    )
  }

}
