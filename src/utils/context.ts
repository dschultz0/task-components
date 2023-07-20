type Mode = 'working' | 'requester-preview' | 'worker-preview' | 'example'
type Site = 'mturk' | 'requester' | 'private-worker'
const PREVIEW_ASSIGNMENT_ID: string = 'ASSIGNMENT_ID_NOT_AVAILABLE'

export class Context {
  params: URLSearchParams
  site: Site
  mode: Mode

  context: string
  domain: string
  endpoint: string

  // MTurk attributes
  assignmentId: string
  hitId: string
  workerId: string

  constructor(location?: Location) {
    this.params = _params(location)
    this.context = this.params.get('context')
    this.domain = this.params.get('domain')
    this.endpoint = this.params.get('endpoint')
    this.assignmentId = this.params.get('assignmentId')
    this.hitId = this.params.get('hitId')
    this.workerId = this.params.get('workerId')

    // @ts-ignore
    this.site = this.params.get('site')
    if (!this.site) {
      if (this.context && this.domain) {
        this.site = 'private-worker'
      } else if (this.assignmentId && this.hitId) {
        this.site = 'mturk'
      } else {
        this.site = 'requester'
      }
    }
    // @ts-ignore
    this.mode = this.params.get('mode')
    if (!this.mode) {
      if (this.site === 'mturk' && this.assignmentId === PREVIEW_ASSIGNMENT_ID) {
        this.mode = 'worker-preview'
      } else if (
        (this.site === 'mturk' && this.assignmentId !== PREVIEW_ASSIGNMENT_ID) ||
        this.site === 'private-worker'
      ) {
        this.mode = 'working'
      } else {
        this.mode = 'requester-preview'
      }
    }
  }
}

function _params(location?: Location) {
  location = location || window.location
  return new URLSearchParams(`${location.search}&${location.hash.substring(1)}`)
}

export const context: Context = new Context
