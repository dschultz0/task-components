type Mode = 'working' | 'requester-preview' | 'worker-preview' | 'example'
type Site = 'mturk' | 'requester' | 'private-worker' | 'open-event'
const PREVIEW_ASSIGNMENT_ID: string = 'ASSIGNMENT_ID_NOT_AVAILABLE'

export class Context {
  params: URLSearchParams
  site: Site
  mode: Mode

  context: string
  domain: string
  endpoint: string
  submitEventType: string

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

    this.loadSite()
    this.loadMode()
  }

  updateFromContextMessage(message: any) {
    this.submitEventType = message.submitEventType
    this.assignmentId = message.assignmentId
    this.context = message.context
    this.workerId = message.workerId
    this.loadSite(message.site)
    this.loadMode(message.mode)
  }

  loadSite(site?: Site) {
    // @ts-ignore
    this.site = site || this.params.get('site')
    if (!this.site) {
      if (this.context && this.domain) {
        this.site = 'private-worker'
      } else if (this.assignmentId && this.hitId) {
        this.site = 'mturk'
      } else {
        this.site = 'requester'
      }
    }
  }

  loadMode(mode? : Mode) {
    // @ts-ignore
    this.mode = mode || this.params.get('mode')
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
  /*
  Retrieves the URLSearchParams for the provided location or the current
  window.location. To enable values passed via the hash (SMGT?) those are
  included as well.
   */
  location = location || window.location
  return new URLSearchParams(`${location.search}&${location.hash.substring(1)}`)
}

export const context: Context = new Context
