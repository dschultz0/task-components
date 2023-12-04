# task-input-dropdown



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute            | Description | Type      | Default     |
| ------------------- | -------------------- | ----------- | --------- | ----------- |
| `disableIf`         | `disable-if`         |             | `string`  | `undefined` |
| `disabled`          | `disabled`           |             | `boolean` | `undefined` |
| `displayIf`         | `display-if`         |             | `string`  | `undefined` |
| `displayOn`         | `display-on`         |             | `string`  | `undefined` |
| `hidden`            | `hidden`             |             | `boolean` | `undefined` |
| `label`             | `label`              |             | `string`  | `undefined` |
| `labelClass`        | `label-class`        |             | `string`  | `undefined` |
| `name`              | `name`               |             | `string`  | `undefined` |
| `requireIf`         | `require-if`         |             | `string`  | `undefined` |
| `required`          | `required`           |             | `boolean` | `undefined` |
| `requiredIndicator` | `required-indicator` |             | `string`  | `undefined` |
| `value`             | `value`              |             | `string`  | `undefined` |
| `valueFrom`         | `value-from`         |             | `string`  | `undefined` |


## Events

| Event                      | Description | Type                                                                                                                              |
| -------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `registerKeyboardShortcut` |             | `CustomEvent<{ label: string; keys: string; value?: string; }>`                                                                   |
| `tc:input`                 |             | `CustomEvent<{ input: HTMLInputElement \| HTMLSelectElement \| HTMLTextAreaElement; form: HTMLFormElement; advance?: boolean; }>` |


## Methods

### `readyToSubmit() => Promise<any>`



#### Returns

Type: `Promise<any>`



### `setShowCorrections() => Promise<any>`



#### Returns

Type: `Promise<any>`



### `validateAgainstAnswer() => Promise<any>`



#### Returns

Type: `Promise<any>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
