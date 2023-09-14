import { Component, Host, h, Prop, Element, Event, EventEmitter, Watch } from '@stencil/core';
import { getActiveElement, isFunction } from '../../utils/utils';
import classNames from 'classnames';


@Component({
  tag: 'task-overlay',
  styleUrl: 'task-overlay.css'
})
export class TaskOverlay {
  @Prop() isOpen: boolean
  @Prop() autoFocus: boolean = true
  @Prop() containerClass: string
  @Prop() enforceFocus: boolean = true
  @Prop() canEscapeKeyClose: boolean = true
  @Prop() canOutsideClickClose: boolean = true
  @Prop() hasBackdrop: boolean = true
  @Prop() shouldReturnFocusOnClose: boolean = true
  @Prop() transitionName: string = "overlay"
  @Prop() transitionDuration: number = 300
  @Prop() backdropClass: string
  @Element() host: HTMLElement
  @Event() close: EventEmitter
  @Event() closed: EventEmitter
  @Event() closing: EventEmitter
  @Event() opened: EventEmitter
  @Event() opening: EventEmitter
  isAutoFocusing: boolean = false
  lastActiveElementBeforeOpened: Element | null | undefined
  startFocusTrapElement: HTMLDivElement
  backdropElement: HTMLDivElement
  endFocusTrapElement: HTMLDivElement
  children: HTMLElement[]

  componentWillLoad() {
    this.children = Array.from(this.host.children) as HTMLElement[]
    console.log(this.children)
  }

  componentDidLoad() {
    if (this.isOpen) {
      this.overlayWillOpen()
    }
  }

  @Watch("isOpen")
  watchIsOpen(newValue: boolean, oldValue: boolean) {
    if (oldValue && !newValue) {
      this.overlayWillClose()
    } else if (!oldValue && newValue) {
      this.overlayWillOpen()
    }
  }

  disconnectedCallback() {
    this.overlayWillClose()
  }

  public bringFocusInsideOverlay() {
    // always delay focus manipulation to just before repaint to prevent scroll jumping
    return window.requestAnimationFrame(() => {
      // container element may be undefined between component mounting and Portal rendering
      // activeElement may be undefined in some rare cases in IE
      const activeElement = getActiveElement(this.host);

      if (this.host == null || activeElement == null || !this.isOpen) {
        return
      }

      const isFocusOutsideModal = !this.host.contains(activeElement);
      if (isFocusOutsideModal) {
        this.startFocusTrapElement.focus({ preventScroll: true });
        this.isAutoFocusing = false;
      }
    })
  }

  maybeRenderChild = (child?: HTMLElement) => {
    console.log(child)
    if (isFunction(child)) {
      child = child();
    }

    if (child == null) {
      console.log("null")
      return null;
    }

    // decorate the child with a few injected props
    const tabIndex = this.enforceFocus || this.autoFocus ? 0 : undefined;
    let decoratedChild: HTMLElement
    if (typeof child === "object") {
      decoratedChild = child.cloneNode() as HTMLElement
      decoratedChild.className = classNames(child.className, "overlay-content")
      decoratedChild.tabIndex = tabIndex
    } else {
      decoratedChild = <span class="content" tabIndex={tabIndex}>{child}</span>
    }

    return decoratedChild
  };

  /**
   * Ensures repeatedly pressing shift+tab keeps focus inside the Overlay. Moves focus to
   * the `endFocusTrapElement` or the first keyboard-focusable element in the Overlay (excluding
   * the `startFocusTrapElement`), depending on whether the element losing focus is inside the
   * Overlay.
   */
  handleStartFocusTrapElementFocus = (e: FocusEvent) => {
    if (!this.enforceFocus || this.isAutoFocusing) {
      return
    }
    // e.relatedTarget will not be defined if this was a programmatic focus event, as is the
    // case when we call this.bringFocusInsideOverlay() after a user clicked on the backdrop.
    // Otherwise, we're handling a user interaction, and we should wrap around to the last
    // element in this transition group.
    if (
      e.relatedTarget != null &&
      this.host?.contains(e.relatedTarget as Element) &&
      e.relatedTarget !== this.endFocusTrapElement
    ) {
      this.endFocusTrapElement?.focus({ preventScroll: true });
    }
  }

  /**
   * Wrap around to the end of the dialog if `enforceFocus` is enabled.
   */
  handleStartFocusTrapElementKeyDown = (e: KeyboardEvent) => {
    if (!this.enforceFocus) {
      return
    }
    if (e.shiftKey && e.key === "Tab") {
      const lastFocusableElement = this.getKeyboardFocusableElements().pop();
      if (lastFocusableElement != null) {
        lastFocusableElement.focus()
      } else {
        this.endFocusTrapElement?.focus({ preventScroll: true })
      }
    }
  }

  /**
   * Ensures repeatedly pressing tab keeps focus inside the Overlay. Moves focus to the
   * `startFocusTrapElement` or the last keyboard-focusable element in the Overlay (excluding the
   * `startFocusTrapElement`), depending on whether the element losing focus is inside the
   * Overlay.
   */
  handleEndFocusTrapElementFocus = (e: FocusEvent) => {
    console.log("handleEndFocusTrapElementFocus")
    // No need for this.props.enforceFocus check here because this element is only rendered
    // when that prop is true.
    // During user interactions, e.relatedTarget will be defined, and we should wrap around to the
    // "start focus trap" element.
    // Otherwise, we're handling a programmatic focus event, which can only happen after a user
    // presses shift+tab from the first focusable element in the overlay.
    console.log(e.target)
    console.log(e.relatedTarget)
    if (
      e.relatedTarget != null &&
      this.host?.contains(e.relatedTarget as Element) &&
      e.relatedTarget !== this.startFocusTrapElement
    ) {
      console.log("a")
      const firstFocusableElement = this.getKeyboardFocusableElements().shift();
      // ensure we don't re-focus an already active element by comparing against e.relatedTarget
      console.log(firstFocusableElement)
      if (!this.isAutoFocusing && firstFocusableElement != null && firstFocusableElement !== e.relatedTarget) {
        firstFocusableElement.focus({preventScroll: true});
      } else {
        this.startFocusTrapElement?.focus({ preventScroll: true });
      }
    } else {
      console.log("b")
      const lastFocusableElement = this.getKeyboardFocusableElements().pop();
      if (lastFocusableElement != null) {
        lastFocusableElement.focus({preventScroll: true});
      } else {
        // Keeps focus within Overlay even if there are no keyboard-focusable children
        this.startFocusTrapElement?.focus({ preventScroll: true });
      }
    }
  }

  getKeyboardFocusableElements() {
    console.log("getKeyboardFocusableElements")
    const focusableElements: HTMLElement[] =
      this.host !== null
        ? Array.from(
          // Order may not be correct if children elements use tabindex values > 0.
          // Selectors derived from this SO question:
          // https://stackoverflow.com/questions/1599660/which-html-elements-can-receive-focus
          this.host.querySelectorAll(
            [
              'a[href]:not([tabindex="-1"])',
              'button:not([disabled]):not([tabindex="-1"])',
              'details:not([tabindex="-1"])',
              'input:not([disabled]):not([tabindex="-1"])',
              'select:not([disabled]):not([tabindex="-1"])',
              'textarea:not([disabled]):not([tabindex="-1"])',
              '[tabindex]:not([tabindex="-1"])',
            ].join(","),
          ),
        )
        : []

    return focusableElements.filter(
      el =>
        !el.classList.contains("start-focus-trap") &&
        !el.classList.contains("end-focus-trap"),
    )
  }

  overlayWillOpen() {
    if (openStack.length > 0) {
      document.removeEventListener("focus", getLastOpened().handleDocumentFocus, {capture: true})
    }
    openStack.push(this)
    if (this.autoFocus) {
      this.isAutoFocusing = true;
      this.bringFocusInsideOverlay();
    }

    if (this.enforceFocus) {
      // Focus events do not bubble, but setting useCapture allows us to listen in and execute
      // our handler before all others
      document.addEventListener("focus", this.handleDocumentFocus,{capture: true});
    }

    if (this.canOutsideClickClose && !this.hasBackdrop) {
      document.addEventListener("mousedown", this.handleDocumentClick);
    }

    if (this.hasBackdrop) {
      // add a class to the body to prevent scrolling of content below the overlay
      document.body.classList.add("overlay-open");
    }

    this.lastActiveElementBeforeOpened = getActiveElement(this.host)
  }

  overlayWillClose() {
    document.removeEventListener("focus", this.handleDocumentFocus, {capture: true});
    document.removeEventListener("mousedown", this.handleDocumentClick);

    const stackIndex = openStack.indexOf(this);
    if (stackIndex !== -1) {
      openStack.splice(stackIndex, 1);
      if (openStack.length > 0) {
        const lastOpenedOverlay = getLastOpened();
        // Only bring focus back to last overlay if it had autoFocus _and_ enforceFocus enabled.
        // If `autoFocus={false}`, it's likely that the overlay never received focus in the first place,
        // so it would be surprising for us to send it there. See https://github.com/palantir/blueprint/issues/4921
        if (lastOpenedOverlay.autoFocus && lastOpenedOverlay.enforceFocus) {
          lastOpenedOverlay.bringFocusInsideOverlay();
          document.addEventListener("focus", lastOpenedOverlay.handleDocumentFocus, /* useCapture */ true);
        }
      }

      if (openStack.filter(o => o.hasBackdrop).length === 0) {
        document.body.classList.remove("overlay-open");
      }
    }
  }

  handleBackdropMouseDown = () => {
    if (this.canOutsideClickClose) {
      this.close.emit()
    }
    if (this.enforceFocus) {
      this.bringFocusInsideOverlay();
    }
  }

  handleDocumentClick = (e: MouseEvent) => {
    const eventTarget = (e.composed ? e.composedPath()[0] : e.target) as HTMLElement;
    const stackIndex = openStack.indexOf(this);
    const isClickInThisOverlayOrDescendant = openStack
      .slice(stackIndex)
      .some(({ host: elem }) => {
        return elem?.contains(eventTarget) && !elem.isSameNode(eventTarget);
      });

    if (this.isOpen && !isClickInThisOverlayOrDescendant && this.canOutsideClickClose) {
      this.close.emit()
    }
  }

  handleDocumentFocus = (e: FocusEvent) => {
    const eventTarget = e.composed ? e.composedPath()[0] : e.target;
    if (
      this.enforceFocus &&
      this.host != null &&
      eventTarget instanceof Node &&
      !this.host.contains(eventTarget as HTMLElement)
    ) {
      // prevent default focus behavior (sometimes auto-scrolls the page)
      e.preventDefault();
      e.stopImmediatePropagation();
      this.bringFocusInsideOverlay();
    }
  }

  handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape" && this.canEscapeKeyClose) {
      this.close.emit()
      e.stopPropagation();
      e.preventDefault();
    }
  }

  render2() {
    return (
      <Host class={this.isOpen ? "overlay-open overlay-scroll-container" : "overlay-scroll-container"}>
        {this.hasBackdrop && <div class="overlay-backdrop"></div>}
        <div class="content">
          <slot></slot>
        </div>
      </Host>
    )
  }

  render() {
    for (let el of this.children) {
      if (this.isOpen) {
        if (!el.classList.contains('overlay-content')) {
          el.className = classNames(el.className, "overlay-content")
        }
        if (this.enforceFocus || this.autoFocus) {
          el.tabIndex = 0
        }
      } else {
        if (el.classList.contains('overlay-content')) {
          el.classList.remove('overlay-content')
        }
        el.tabIndex = undefined
      }
    }

    const containerClasses = classNames(
      "overlay",
      {
        ["overlay-open"]: this.isOpen
      },
      this.containerClass,
      "overlay-portal" // TODO: Evaluate how exactly we want to handle top-level overlay
    )

    return (
      <Host class={containerClasses} onKeyDown={e => this.handleKeyDown(e)}>
        {this.isOpen && (this.autoFocus || this.enforceFocus) ?
          <div
            key="__start"
            class="start-focus-trap"
            tabindex={0}
            onFocus={e => this.handleStartFocusTrapElementFocus(e)}
            onKeyDown={e => this.handleStartFocusTrapElementKeyDown(e)}
            ref={el => this.startFocusTrapElement = el}
          /> : null}
        {this.hasBackdrop && this.isOpen ?
          <div
            key="__backdrop"
            class={classNames("overlay-backdrop", this.backdropClass)}
            onMouseDown={() => this.handleBackdropMouseDown()}
            ref={el => this.backdropElement = el as HTMLDivElement}
          ></div> : null}
        <div key="__content" class={this.isOpen ? "" : "overlay-closed"}>
          <slot></slot>
        </div>
        {this.isOpen && this.enforceFocus ?
          <div
            key="__end"
            class="end-focus-trap"
            tabindex={0}
            onFocus={e => this.handleEndFocusTrapElementFocus(e)}
            ref={el => this.endFocusTrapElement = el as HTMLDivElement}
          /> : null}
      </Host>
    )
  }
}

const openStack: TaskOverlay[] = []
const getLastOpened = () => openStack[openStack.length - 1]
