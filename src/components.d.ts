/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { KeyboardShortcut } from "./utils/utils";
import { TaskCard } from "./components/task-card/task-card";
export { KeyboardShortcut } from "./utils/utils";
export { TaskCard } from "./components/task-card/task-card";
export namespace Components {
    interface TaskAnswer {
        "showAnswer": boolean;
        "value": string;
    }
    interface TaskAnswerCorrection {
        "displayCorrection": boolean;
        "displayOn": string;
        "onDisplayEvent": string;
        "preventChanges": boolean;
        "showAnswer": boolean;
    }
    interface TaskAsset {
        "asset": string;
        "value": string;
    }
    interface TaskBody {
        "localId": string;
        "saveLocal": boolean;
    }
    interface TaskButton {
        "active": boolean;
        "alignText": string;
        "anchor": boolean;
        "disabled": boolean;
        "fill": boolean;
        "href": string;
        "icon": string;
        "intent": string;
        "label": boolean;
        "large": boolean;
        "loading": boolean;
        "minimal": boolean;
        "newWindow": boolean;
        "outlined": boolean;
        "rightIcon": string;
        "selected": boolean;
        "small": boolean;
        "tabindex": string;
        "target": string;
        "text": string;
        "type": string;
    }
    interface TaskButtonGroup {
        "alignText": string;
        "fill": boolean;
        "large": boolean;
        "minimal": boolean;
        "vertical": boolean;
    }
    interface TaskCallout {
        "intent": string;
    }
    interface TaskCard {
        "active": boolean;
        "readyToSubmit": () => Promise<boolean>;
        "width": number;
    }
    interface TaskCardList {
        "advanceWhenComplete": boolean;
        "backKeyboardShortcut": string;
        "forwardKeyboardShortcut": string;
    }
    interface TaskColumn {
    }
    interface TaskColumns {
    }
    interface TaskDialog {
        "headerText": string;
        "isCloseButtonShown": boolean;
        "isOpen": boolean;
    }
    interface TaskIcon {
        "icon": string;
        "size": number;
    }
    interface TaskImage {
        "cropCoordinates": string;
        "cropHeight": number;
        "cropLeft": number;
        "cropTop": number;
        "cropWidth": number;
        "height": string;
        "hoverZoom": boolean;
        "src": string;
        "width": string;
        "zoomPercentage": number;
        "zoomSize": string;
    }
    interface TaskImageBox {
        "color": string;
        "coordinates": string;
        "drawBox": (context: CanvasRenderingContext2D, scalar?: number, xOffset?: number, yOffset?: number) => Promise<void>;
        "height": number;
        "left": number;
        "lineWidth": number;
        "top": number;
        "width": number;
    }
    interface TaskInfoPane {
        "width": string;
    }
    interface TaskInfoSection {
        "header": string;
    }
    interface TaskInput {
        "active": boolean;
        "cols": number;
        "disabled": boolean;
        "displayIf": string;
        "displayOn": string;
        "hidden": boolean;
        "label": string;
        "labelClass": string;
        "maxlength": number;
        "name": string;
        "placeholder": string;
        "readyToSubmit": () => Promise<any>;
        "requireIf": string;
        "required": boolean;
        "requiredIndicator": string;
        "rows": number;
        "setShowCorrections": () => Promise<any>;
        "size": number;
        "type": string;
        "validateAgainstAnswer": () => Promise<any>;
        "value": string;
    }
    interface TaskInputMultiselect {
        "active": boolean;
        "disabled": boolean;
        "displayIf": string;
        "displayOn": string;
        "hidden": boolean;
        "label": string;
        "labelClass": string;
        "name": string;
        "placeholder": string;
        "readyToSubmit": () => Promise<boolean>;
        "requireIf": string;
        "required": boolean;
        "requiredIndicator": string;
        "setShowCorrections": () => Promise<any>;
        "validateAgainstAnswer": () => Promise<any>;
        "value": string;
    }
    interface TaskInputOption {
        "keyboardShortcut": string;
        "keyboardShortcutLabel": string;
        "value": string;
    }
    interface TaskInputRadio {
        "active": boolean;
        "answerTag": string;
        "disabled": boolean;
        "displayIf": string;
        "displayOn": string;
        "hidden": boolean;
        "inline": boolean;
        "label": string;
        "labelClass": string;
        "mode": string;
        "name": string;
        "readyToSubmit": () => Promise<any>;
        "requireIf": string;
        "required": boolean;
        "requiredIndicator": string;
        "setShowCorrections": () => Promise<any>;
        "validateAgainstAnswer": () => Promise<boolean>;
        "value": string;
    }
    interface TaskInputSelect {
        "active": boolean;
        "disabled": boolean;
        "displayIf": string;
        "displayOn": string;
        "hidden": boolean;
        "label": string;
        "labelClass": string;
        "name": string;
        "readyToSubmit": () => Promise<any>;
        "requireIf": string;
        "required": boolean;
        "requiredIndicator": string;
        "setShowCorrections": () => Promise<any>;
        "validateAgainstAnswer": () => Promise<any>;
        "value": string;
    }
    interface TaskInstructions {
        "header": string;
        "tab": string;
    }
    interface TaskIterate {
        "values": string;
    }
    interface TaskKeyboardShortcut {
        "keyboardShortcut": string;
    }
    interface TaskKeyboardShortcutList {
        "addShortCut": (shortcut: KeyboardShortcut) => Promise<void>;
    }
    interface TaskLabel {
    }
    interface TaskLink {
        "customStyle": string;
        "href": string;
        "type": string;
    }
    interface TaskMain {
    }
    interface TaskMarkdown {
        "markdown_url": string;
    }
    interface TaskOverlay {
        "autoFocus": boolean;
        "backdropClass": string;
        "canEscapeKeyClose": boolean;
        "canOutsideClickClose": boolean;
        "containerClass": string;
        "enforceFocus": boolean;
        "hasBackdrop": boolean;
        "isOpen": boolean;
        "shouldReturnFocusOnClose": boolean;
        "transitionDuration": number;
        "transitionName": string;
    }
    interface TaskProgressbar {
        "completedCount": number;
        "mode": string;
        "refreshProgress": () => Promise<void>;
        "taskCount": number;
    }
    interface TaskRow {
    }
    interface TaskStep {
        "active": boolean;
        "label": string;
        "readyToSubmit": () => Promise<boolean>;
    }
    interface TaskSteps {
    }
    interface TaskSubmit {
        "disableUntilComplete": boolean;
        "disabled": boolean;
        "keyboardShortcut": string;
        "refreshSubmitReady": () => Promise<void>;
        "setShowCorrections": (value: boolean) => Promise<void>;
    }
    interface TaskSummary {
    }
    interface TaskTag {
        "color": string;
        "interactive": boolean;
        "large": boolean;
        "minimal": boolean;
        "onremove": () => void;
        "removable": boolean;
        "round": boolean;
        "small": boolean;
    }
    interface TaskTooltip {
        "icon": string;
    }
    interface TaskVar {
        "name": string;
    }
}
export interface TaskAnswerCorrectionCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTaskAnswerCorrectionElement;
}
export interface TaskButtonCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTaskButtonElement;
}
export interface TaskCardCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTaskCardElement;
}
export interface TaskCardListCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTaskCardListElement;
}
export interface TaskDialogCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTaskDialogElement;
}
export interface TaskInputCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTaskInputElement;
}
export interface TaskInputMultiselectCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTaskInputMultiselectElement;
}
export interface TaskInputRadioCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTaskInputRadioElement;
}
export interface TaskInputSelectCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTaskInputSelectElement;
}
export interface TaskOverlayCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTaskOverlayElement;
}
export interface TaskStepCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTaskStepElement;
}
export interface TaskSubmitCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTaskSubmitElement;
}
declare global {
    interface HTMLTaskAnswerElement extends Components.TaskAnswer, HTMLStencilElement {
    }
    var HTMLTaskAnswerElement: {
        prototype: HTMLTaskAnswerElement;
        new (): HTMLTaskAnswerElement;
    };
    interface HTMLTaskAnswerCorrectionElement extends Components.TaskAnswerCorrection, HTMLStencilElement {
    }
    var HTMLTaskAnswerCorrectionElement: {
        prototype: HTMLTaskAnswerCorrectionElement;
        new (): HTMLTaskAnswerCorrectionElement;
    };
    interface HTMLTaskAssetElement extends Components.TaskAsset, HTMLStencilElement {
    }
    var HTMLTaskAssetElement: {
        prototype: HTMLTaskAssetElement;
        new (): HTMLTaskAssetElement;
    };
    interface HTMLTaskBodyElement extends Components.TaskBody, HTMLStencilElement {
    }
    var HTMLTaskBodyElement: {
        prototype: HTMLTaskBodyElement;
        new (): HTMLTaskBodyElement;
    };
    interface HTMLTaskButtonElement extends Components.TaskButton, HTMLStencilElement {
    }
    var HTMLTaskButtonElement: {
        prototype: HTMLTaskButtonElement;
        new (): HTMLTaskButtonElement;
    };
    interface HTMLTaskButtonGroupElement extends Components.TaskButtonGroup, HTMLStencilElement {
    }
    var HTMLTaskButtonGroupElement: {
        prototype: HTMLTaskButtonGroupElement;
        new (): HTMLTaskButtonGroupElement;
    };
    interface HTMLTaskCalloutElement extends Components.TaskCallout, HTMLStencilElement {
    }
    var HTMLTaskCalloutElement: {
        prototype: HTMLTaskCalloutElement;
        new (): HTMLTaskCalloutElement;
    };
    interface HTMLTaskCardElement extends Components.TaskCard, HTMLStencilElement {
    }
    var HTMLTaskCardElement: {
        prototype: HTMLTaskCardElement;
        new (): HTMLTaskCardElement;
    };
    interface HTMLTaskCardListElement extends Components.TaskCardList, HTMLStencilElement {
    }
    var HTMLTaskCardListElement: {
        prototype: HTMLTaskCardListElement;
        new (): HTMLTaskCardListElement;
    };
    interface HTMLTaskColumnElement extends Components.TaskColumn, HTMLStencilElement {
    }
    var HTMLTaskColumnElement: {
        prototype: HTMLTaskColumnElement;
        new (): HTMLTaskColumnElement;
    };
    interface HTMLTaskColumnsElement extends Components.TaskColumns, HTMLStencilElement {
    }
    var HTMLTaskColumnsElement: {
        prototype: HTMLTaskColumnsElement;
        new (): HTMLTaskColumnsElement;
    };
    interface HTMLTaskDialogElement extends Components.TaskDialog, HTMLStencilElement {
    }
    var HTMLTaskDialogElement: {
        prototype: HTMLTaskDialogElement;
        new (): HTMLTaskDialogElement;
    };
    interface HTMLTaskIconElement extends Components.TaskIcon, HTMLStencilElement {
    }
    var HTMLTaskIconElement: {
        prototype: HTMLTaskIconElement;
        new (): HTMLTaskIconElement;
    };
    interface HTMLTaskImageElement extends Components.TaskImage, HTMLStencilElement {
    }
    var HTMLTaskImageElement: {
        prototype: HTMLTaskImageElement;
        new (): HTMLTaskImageElement;
    };
    interface HTMLTaskImageBoxElement extends Components.TaskImageBox, HTMLStencilElement {
    }
    var HTMLTaskImageBoxElement: {
        prototype: HTMLTaskImageBoxElement;
        new (): HTMLTaskImageBoxElement;
    };
    interface HTMLTaskInfoPaneElement extends Components.TaskInfoPane, HTMLStencilElement {
    }
    var HTMLTaskInfoPaneElement: {
        prototype: HTMLTaskInfoPaneElement;
        new (): HTMLTaskInfoPaneElement;
    };
    interface HTMLTaskInfoSectionElement extends Components.TaskInfoSection, HTMLStencilElement {
    }
    var HTMLTaskInfoSectionElement: {
        prototype: HTMLTaskInfoSectionElement;
        new (): HTMLTaskInfoSectionElement;
    };
    interface HTMLTaskInputElement extends Components.TaskInput, HTMLStencilElement {
    }
    var HTMLTaskInputElement: {
        prototype: HTMLTaskInputElement;
        new (): HTMLTaskInputElement;
    };
    interface HTMLTaskInputMultiselectElement extends Components.TaskInputMultiselect, HTMLStencilElement {
    }
    var HTMLTaskInputMultiselectElement: {
        prototype: HTMLTaskInputMultiselectElement;
        new (): HTMLTaskInputMultiselectElement;
    };
    interface HTMLTaskInputOptionElement extends Components.TaskInputOption, HTMLStencilElement {
    }
    var HTMLTaskInputOptionElement: {
        prototype: HTMLTaskInputOptionElement;
        new (): HTMLTaskInputOptionElement;
    };
    interface HTMLTaskInputRadioElement extends Components.TaskInputRadio, HTMLStencilElement {
    }
    var HTMLTaskInputRadioElement: {
        prototype: HTMLTaskInputRadioElement;
        new (): HTMLTaskInputRadioElement;
    };
    interface HTMLTaskInputSelectElement extends Components.TaskInputSelect, HTMLStencilElement {
    }
    var HTMLTaskInputSelectElement: {
        prototype: HTMLTaskInputSelectElement;
        new (): HTMLTaskInputSelectElement;
    };
    interface HTMLTaskInstructionsElement extends Components.TaskInstructions, HTMLStencilElement {
    }
    var HTMLTaskInstructionsElement: {
        prototype: HTMLTaskInstructionsElement;
        new (): HTMLTaskInstructionsElement;
    };
    interface HTMLTaskIterateElement extends Components.TaskIterate, HTMLStencilElement {
    }
    var HTMLTaskIterateElement: {
        prototype: HTMLTaskIterateElement;
        new (): HTMLTaskIterateElement;
    };
    interface HTMLTaskKeyboardShortcutElement extends Components.TaskKeyboardShortcut, HTMLStencilElement {
    }
    var HTMLTaskKeyboardShortcutElement: {
        prototype: HTMLTaskKeyboardShortcutElement;
        new (): HTMLTaskKeyboardShortcutElement;
    };
    interface HTMLTaskKeyboardShortcutListElement extends Components.TaskKeyboardShortcutList, HTMLStencilElement {
    }
    var HTMLTaskKeyboardShortcutListElement: {
        prototype: HTMLTaskKeyboardShortcutListElement;
        new (): HTMLTaskKeyboardShortcutListElement;
    };
    interface HTMLTaskLabelElement extends Components.TaskLabel, HTMLStencilElement {
    }
    var HTMLTaskLabelElement: {
        prototype: HTMLTaskLabelElement;
        new (): HTMLTaskLabelElement;
    };
    interface HTMLTaskLinkElement extends Components.TaskLink, HTMLStencilElement {
    }
    var HTMLTaskLinkElement: {
        prototype: HTMLTaskLinkElement;
        new (): HTMLTaskLinkElement;
    };
    interface HTMLTaskMainElement extends Components.TaskMain, HTMLStencilElement {
    }
    var HTMLTaskMainElement: {
        prototype: HTMLTaskMainElement;
        new (): HTMLTaskMainElement;
    };
    interface HTMLTaskMarkdownElement extends Components.TaskMarkdown, HTMLStencilElement {
    }
    var HTMLTaskMarkdownElement: {
        prototype: HTMLTaskMarkdownElement;
        new (): HTMLTaskMarkdownElement;
    };
    interface HTMLTaskOverlayElement extends Components.TaskOverlay, HTMLStencilElement {
    }
    var HTMLTaskOverlayElement: {
        prototype: HTMLTaskOverlayElement;
        new (): HTMLTaskOverlayElement;
    };
    interface HTMLTaskProgressbarElement extends Components.TaskProgressbar, HTMLStencilElement {
    }
    var HTMLTaskProgressbarElement: {
        prototype: HTMLTaskProgressbarElement;
        new (): HTMLTaskProgressbarElement;
    };
    interface HTMLTaskRowElement extends Components.TaskRow, HTMLStencilElement {
    }
    var HTMLTaskRowElement: {
        prototype: HTMLTaskRowElement;
        new (): HTMLTaskRowElement;
    };
    interface HTMLTaskStepElement extends Components.TaskStep, HTMLStencilElement {
    }
    var HTMLTaskStepElement: {
        prototype: HTMLTaskStepElement;
        new (): HTMLTaskStepElement;
    };
    interface HTMLTaskStepsElement extends Components.TaskSteps, HTMLStencilElement {
    }
    var HTMLTaskStepsElement: {
        prototype: HTMLTaskStepsElement;
        new (): HTMLTaskStepsElement;
    };
    interface HTMLTaskSubmitElement extends Components.TaskSubmit, HTMLStencilElement {
    }
    var HTMLTaskSubmitElement: {
        prototype: HTMLTaskSubmitElement;
        new (): HTMLTaskSubmitElement;
    };
    interface HTMLTaskSummaryElement extends Components.TaskSummary, HTMLStencilElement {
    }
    var HTMLTaskSummaryElement: {
        prototype: HTMLTaskSummaryElement;
        new (): HTMLTaskSummaryElement;
    };
    interface HTMLTaskTagElement extends Components.TaskTag, HTMLStencilElement {
    }
    var HTMLTaskTagElement: {
        prototype: HTMLTaskTagElement;
        new (): HTMLTaskTagElement;
    };
    interface HTMLTaskTooltipElement extends Components.TaskTooltip, HTMLStencilElement {
    }
    var HTMLTaskTooltipElement: {
        prototype: HTMLTaskTooltipElement;
        new (): HTMLTaskTooltipElement;
    };
    interface HTMLTaskVarElement extends Components.TaskVar, HTMLStencilElement {
    }
    var HTMLTaskVarElement: {
        prototype: HTMLTaskVarElement;
        new (): HTMLTaskVarElement;
    };
    interface HTMLElementTagNameMap {
        "task-answer": HTMLTaskAnswerElement;
        "task-answer-correction": HTMLTaskAnswerCorrectionElement;
        "task-asset": HTMLTaskAssetElement;
        "task-body": HTMLTaskBodyElement;
        "task-button": HTMLTaskButtonElement;
        "task-button-group": HTMLTaskButtonGroupElement;
        "task-callout": HTMLTaskCalloutElement;
        "task-card": HTMLTaskCardElement;
        "task-card-list": HTMLTaskCardListElement;
        "task-column": HTMLTaskColumnElement;
        "task-columns": HTMLTaskColumnsElement;
        "task-dialog": HTMLTaskDialogElement;
        "task-icon": HTMLTaskIconElement;
        "task-image": HTMLTaskImageElement;
        "task-image-box": HTMLTaskImageBoxElement;
        "task-info-pane": HTMLTaskInfoPaneElement;
        "task-info-section": HTMLTaskInfoSectionElement;
        "task-input": HTMLTaskInputElement;
        "task-input-multiselect": HTMLTaskInputMultiselectElement;
        "task-input-option": HTMLTaskInputOptionElement;
        "task-input-radio": HTMLTaskInputRadioElement;
        "task-input-select": HTMLTaskInputSelectElement;
        "task-instructions": HTMLTaskInstructionsElement;
        "task-iterate": HTMLTaskIterateElement;
        "task-keyboard-shortcut": HTMLTaskKeyboardShortcutElement;
        "task-keyboard-shortcut-list": HTMLTaskKeyboardShortcutListElement;
        "task-label": HTMLTaskLabelElement;
        "task-link": HTMLTaskLinkElement;
        "task-main": HTMLTaskMainElement;
        "task-markdown": HTMLTaskMarkdownElement;
        "task-overlay": HTMLTaskOverlayElement;
        "task-progressbar": HTMLTaskProgressbarElement;
        "task-row": HTMLTaskRowElement;
        "task-step": HTMLTaskStepElement;
        "task-steps": HTMLTaskStepsElement;
        "task-submit": HTMLTaskSubmitElement;
        "task-summary": HTMLTaskSummaryElement;
        "task-tag": HTMLTaskTagElement;
        "task-tooltip": HTMLTaskTooltipElement;
        "task-var": HTMLTaskVarElement;
    }
}
declare namespace LocalJSX {
    interface TaskAnswer {
        "showAnswer"?: boolean;
        "value"?: string;
    }
    interface TaskAnswerCorrection {
        "displayCorrection"?: boolean;
        "displayOn"?: string;
        "onDisplay"?: (event: TaskAnswerCorrectionCustomEvent<boolean>) => void;
        "onDisplayEvent"?: string;
        "preventChanges"?: boolean;
        "showAnswer"?: boolean;
    }
    interface TaskAsset {
        "asset"?: string;
        "value"?: string;
    }
    interface TaskBody {
        "localId"?: string;
        "saveLocal"?: boolean;
    }
    interface TaskButton {
        "active"?: boolean;
        "alignText"?: string;
        "anchor"?: boolean;
        "disabled"?: boolean;
        "fill"?: boolean;
        "href"?: string;
        "icon"?: string;
        "intent"?: string;
        "label"?: boolean;
        "large"?: boolean;
        "loading"?: boolean;
        "minimal"?: boolean;
        "newWindow"?: boolean;
        "onClick"?: (event: TaskButtonCustomEvent<any>) => void;
        "onFocus"?: (event: TaskButtonCustomEvent<any>) => void;
        "outlined"?: boolean;
        "rightIcon"?: string;
        "selected"?: boolean;
        "small"?: boolean;
        "tabindex"?: string;
        "target"?: string;
        "text"?: string;
        "type"?: string;
    }
    interface TaskButtonGroup {
        "alignText"?: string;
        "fill"?: boolean;
        "large"?: boolean;
        "minimal"?: boolean;
        "vertical"?: boolean;
    }
    interface TaskCallout {
        "intent"?: string;
    }
    interface TaskCard {
        "active"?: boolean;
        "onCardClicked"?: (event: TaskCardCustomEvent<TaskCard>) => void;
        "onCardReadyToSubmit"?: (event: TaskCardCustomEvent<boolean>) => void;
        "width"?: number;
    }
    interface TaskCardList {
        "advanceWhenComplete"?: boolean;
        "backKeyboardShortcut"?: string;
        "forwardKeyboardShortcut"?: string;
        "onRegisterKeyboardShortcut"?: (event: TaskCardListCustomEvent<KeyboardShortcut>) => void;
    }
    interface TaskColumn {
    }
    interface TaskColumns {
    }
    interface TaskDialog {
        "headerText"?: string;
        "isCloseButtonShown"?: boolean;
        "isOpen"?: boolean;
        "onClose"?: (event: TaskDialogCustomEvent<any>) => void;
    }
    interface TaskIcon {
        "icon"?: string;
        "size"?: number;
    }
    interface TaskImage {
        "cropCoordinates"?: string;
        "cropHeight"?: number;
        "cropLeft"?: number;
        "cropTop"?: number;
        "cropWidth"?: number;
        "height"?: string;
        "hoverZoom"?: boolean;
        "src"?: string;
        "width"?: string;
        "zoomPercentage"?: number;
        "zoomSize"?: string;
    }
    interface TaskImageBox {
        "color"?: string;
        "coordinates"?: string;
        "height"?: number;
        "left"?: number;
        "lineWidth"?: number;
        "top"?: number;
        "width"?: number;
    }
    interface TaskInfoPane {
        "width"?: string;
    }
    interface TaskInfoSection {
        "header"?: string;
    }
    interface TaskInput {
        "active"?: boolean;
        "cols"?: number;
        "disabled"?: boolean;
        "displayIf"?: string;
        "displayOn"?: string;
        "hidden"?: boolean;
        "label"?: string;
        "labelClass"?: string;
        "maxlength"?: number;
        "name"?: string;
        "onInputUpdated"?: (event: TaskInputCustomEvent<HTMLElement>) => void;
        "placeholder"?: string;
        "requireIf"?: string;
        "required"?: boolean;
        "requiredIndicator"?: string;
        "rows"?: number;
        "size"?: number;
        "type"?: string;
        "value"?: string;
    }
    interface TaskInputMultiselect {
        "active"?: boolean;
        "disabled"?: boolean;
        "displayIf"?: string;
        "displayOn"?: string;
        "hidden"?: boolean;
        "label"?: string;
        "labelClass"?: string;
        "name"?: string;
        "onInputUpdated"?: (event: TaskInputMultiselectCustomEvent<HTMLElement>) => void;
        "onRegisterKeyboardShortcut"?: (event: TaskInputMultiselectCustomEvent<KeyboardShortcut>) => void;
        "placeholder"?: string;
        "requireIf"?: string;
        "required"?: boolean;
        "requiredIndicator"?: string;
        "value"?: string;
    }
    interface TaskInputOption {
        "keyboardShortcut"?: string;
        "keyboardShortcutLabel"?: string;
        "value"?: string;
    }
    interface TaskInputRadio {
        "active"?: boolean;
        "answerTag"?: string;
        "disabled"?: boolean;
        "displayIf"?: string;
        "displayOn"?: string;
        "hidden"?: boolean;
        "inline"?: boolean;
        "label"?: string;
        "labelClass"?: string;
        "mode"?: string;
        "name"?: string;
        "onInputUpdated"?: (event: TaskInputRadioCustomEvent<HTMLElement>) => void;
        "onRegisterKeyboardShortcut"?: (event: TaskInputRadioCustomEvent<KeyboardShortcut>) => void;
        "requireIf"?: string;
        "required"?: boolean;
        "requiredIndicator"?: string;
        "value"?: string;
    }
    interface TaskInputSelect {
        "active"?: boolean;
        "disabled"?: boolean;
        "displayIf"?: string;
        "displayOn"?: string;
        "hidden"?: boolean;
        "label"?: string;
        "labelClass"?: string;
        "name"?: string;
        "onInputUpdated"?: (event: TaskInputSelectCustomEvent<HTMLElement>) => void;
        "onRegisterKeyboardShortcut"?: (event: TaskInputSelectCustomEvent<KeyboardShortcut>) => void;
        "requireIf"?: string;
        "required"?: boolean;
        "requiredIndicator"?: string;
        "value"?: string;
    }
    interface TaskInstructions {
        "header"?: string;
        "tab"?: string;
    }
    interface TaskIterate {
        "values"?: string;
    }
    interface TaskKeyboardShortcut {
        "keyboardShortcut"?: string;
    }
    interface TaskKeyboardShortcutList {
    }
    interface TaskLabel {
    }
    interface TaskLink {
        "customStyle"?: string;
        "href"?: string;
        "type"?: string;
    }
    interface TaskMain {
    }
    interface TaskMarkdown {
        "markdown_url"?: string;
    }
    interface TaskOverlay {
        "autoFocus"?: boolean;
        "backdropClass"?: string;
        "canEscapeKeyClose"?: boolean;
        "canOutsideClickClose"?: boolean;
        "containerClass"?: string;
        "enforceFocus"?: boolean;
        "hasBackdrop"?: boolean;
        "isOpen"?: boolean;
        "onClose"?: (event: TaskOverlayCustomEvent<any>) => void;
        "onClosed"?: (event: TaskOverlayCustomEvent<any>) => void;
        "onClosing"?: (event: TaskOverlayCustomEvent<any>) => void;
        "onOpened"?: (event: TaskOverlayCustomEvent<any>) => void;
        "onOpening"?: (event: TaskOverlayCustomEvent<any>) => void;
        "shouldReturnFocusOnClose"?: boolean;
        "transitionDuration"?: number;
        "transitionName"?: string;
    }
    interface TaskProgressbar {
        "completedCount"?: number;
        "mode"?: string;
        "taskCount"?: number;
    }
    interface TaskRow {
    }
    interface TaskStep {
        "active"?: boolean;
        "label"?: string;
        "onCardClicked"?: (event: TaskStepCustomEvent<TaskStep>) => void;
        "onCardReadyToSubmit"?: (event: TaskStepCustomEvent<boolean>) => void;
    }
    interface TaskSteps {
    }
    interface TaskSubmit {
        "disableUntilComplete"?: boolean;
        "disabled"?: boolean;
        "keyboardShortcut"?: string;
        "onRegisterKeyboardShortcut"?: (event: TaskSubmitCustomEvent<KeyboardShortcut>) => void;
        "onShowCorrections"?: (event: TaskSubmitCustomEvent<any>) => void;
        "onTaskSubmit"?: (event: TaskSubmitCustomEvent<any>) => void;
    }
    interface TaskSummary {
    }
    interface TaskTag {
        "color"?: string;
        "interactive"?: boolean;
        "large"?: boolean;
        "minimal"?: boolean;
        "onremove"?: () => void;
        "removable"?: boolean;
        "round"?: boolean;
        "small"?: boolean;
    }
    interface TaskTooltip {
        "icon"?: string;
    }
    interface TaskVar {
        "name"?: string;
    }
    interface IntrinsicElements {
        "task-answer": TaskAnswer;
        "task-answer-correction": TaskAnswerCorrection;
        "task-asset": TaskAsset;
        "task-body": TaskBody;
        "task-button": TaskButton;
        "task-button-group": TaskButtonGroup;
        "task-callout": TaskCallout;
        "task-card": TaskCard;
        "task-card-list": TaskCardList;
        "task-column": TaskColumn;
        "task-columns": TaskColumns;
        "task-dialog": TaskDialog;
        "task-icon": TaskIcon;
        "task-image": TaskImage;
        "task-image-box": TaskImageBox;
        "task-info-pane": TaskInfoPane;
        "task-info-section": TaskInfoSection;
        "task-input": TaskInput;
        "task-input-multiselect": TaskInputMultiselect;
        "task-input-option": TaskInputOption;
        "task-input-radio": TaskInputRadio;
        "task-input-select": TaskInputSelect;
        "task-instructions": TaskInstructions;
        "task-iterate": TaskIterate;
        "task-keyboard-shortcut": TaskKeyboardShortcut;
        "task-keyboard-shortcut-list": TaskKeyboardShortcutList;
        "task-label": TaskLabel;
        "task-link": TaskLink;
        "task-main": TaskMain;
        "task-markdown": TaskMarkdown;
        "task-overlay": TaskOverlay;
        "task-progressbar": TaskProgressbar;
        "task-row": TaskRow;
        "task-step": TaskStep;
        "task-steps": TaskSteps;
        "task-submit": TaskSubmit;
        "task-summary": TaskSummary;
        "task-tag": TaskTag;
        "task-tooltip": TaskTooltip;
        "task-var": TaskVar;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "task-answer": LocalJSX.TaskAnswer & JSXBase.HTMLAttributes<HTMLTaskAnswerElement>;
            "task-answer-correction": LocalJSX.TaskAnswerCorrection & JSXBase.HTMLAttributes<HTMLTaskAnswerCorrectionElement>;
            "task-asset": LocalJSX.TaskAsset & JSXBase.HTMLAttributes<HTMLTaskAssetElement>;
            "task-body": LocalJSX.TaskBody & JSXBase.HTMLAttributes<HTMLTaskBodyElement>;
            "task-button": LocalJSX.TaskButton & JSXBase.HTMLAttributes<HTMLTaskButtonElement>;
            "task-button-group": LocalJSX.TaskButtonGroup & JSXBase.HTMLAttributes<HTMLTaskButtonGroupElement>;
            "task-callout": LocalJSX.TaskCallout & JSXBase.HTMLAttributes<HTMLTaskCalloutElement>;
            "task-card": LocalJSX.TaskCard & JSXBase.HTMLAttributes<HTMLTaskCardElement>;
            "task-card-list": LocalJSX.TaskCardList & JSXBase.HTMLAttributes<HTMLTaskCardListElement>;
            "task-column": LocalJSX.TaskColumn & JSXBase.HTMLAttributes<HTMLTaskColumnElement>;
            "task-columns": LocalJSX.TaskColumns & JSXBase.HTMLAttributes<HTMLTaskColumnsElement>;
            "task-dialog": LocalJSX.TaskDialog & JSXBase.HTMLAttributes<HTMLTaskDialogElement>;
            "task-icon": LocalJSX.TaskIcon & JSXBase.HTMLAttributes<HTMLTaskIconElement>;
            "task-image": LocalJSX.TaskImage & JSXBase.HTMLAttributes<HTMLTaskImageElement>;
            "task-image-box": LocalJSX.TaskImageBox & JSXBase.HTMLAttributes<HTMLTaskImageBoxElement>;
            "task-info-pane": LocalJSX.TaskInfoPane & JSXBase.HTMLAttributes<HTMLTaskInfoPaneElement>;
            "task-info-section": LocalJSX.TaskInfoSection & JSXBase.HTMLAttributes<HTMLTaskInfoSectionElement>;
            "task-input": LocalJSX.TaskInput & JSXBase.HTMLAttributes<HTMLTaskInputElement>;
            "task-input-multiselect": LocalJSX.TaskInputMultiselect & JSXBase.HTMLAttributes<HTMLTaskInputMultiselectElement>;
            "task-input-option": LocalJSX.TaskInputOption & JSXBase.HTMLAttributes<HTMLTaskInputOptionElement>;
            "task-input-radio": LocalJSX.TaskInputRadio & JSXBase.HTMLAttributes<HTMLTaskInputRadioElement>;
            "task-input-select": LocalJSX.TaskInputSelect & JSXBase.HTMLAttributes<HTMLTaskInputSelectElement>;
            "task-instructions": LocalJSX.TaskInstructions & JSXBase.HTMLAttributes<HTMLTaskInstructionsElement>;
            "task-iterate": LocalJSX.TaskIterate & JSXBase.HTMLAttributes<HTMLTaskIterateElement>;
            "task-keyboard-shortcut": LocalJSX.TaskKeyboardShortcut & JSXBase.HTMLAttributes<HTMLTaskKeyboardShortcutElement>;
            "task-keyboard-shortcut-list": LocalJSX.TaskKeyboardShortcutList & JSXBase.HTMLAttributes<HTMLTaskKeyboardShortcutListElement>;
            "task-label": LocalJSX.TaskLabel & JSXBase.HTMLAttributes<HTMLTaskLabelElement>;
            "task-link": LocalJSX.TaskLink & JSXBase.HTMLAttributes<HTMLTaskLinkElement>;
            "task-main": LocalJSX.TaskMain & JSXBase.HTMLAttributes<HTMLTaskMainElement>;
            "task-markdown": LocalJSX.TaskMarkdown & JSXBase.HTMLAttributes<HTMLTaskMarkdownElement>;
            "task-overlay": LocalJSX.TaskOverlay & JSXBase.HTMLAttributes<HTMLTaskOverlayElement>;
            "task-progressbar": LocalJSX.TaskProgressbar & JSXBase.HTMLAttributes<HTMLTaskProgressbarElement>;
            "task-row": LocalJSX.TaskRow & JSXBase.HTMLAttributes<HTMLTaskRowElement>;
            "task-step": LocalJSX.TaskStep & JSXBase.HTMLAttributes<HTMLTaskStepElement>;
            "task-steps": LocalJSX.TaskSteps & JSXBase.HTMLAttributes<HTMLTaskStepsElement>;
            "task-submit": LocalJSX.TaskSubmit & JSXBase.HTMLAttributes<HTMLTaskSubmitElement>;
            "task-summary": LocalJSX.TaskSummary & JSXBase.HTMLAttributes<HTMLTaskSummaryElement>;
            "task-tag": LocalJSX.TaskTag & JSXBase.HTMLAttributes<HTMLTaskTagElement>;
            "task-tooltip": LocalJSX.TaskTooltip & JSXBase.HTMLAttributes<HTMLTaskTooltipElement>;
            "task-var": LocalJSX.TaskVar & JSXBase.HTMLAttributes<HTMLTaskVarElement>;
        }
    }
}
