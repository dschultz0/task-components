# task-submit



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute                | Description | Type      | Default     |
| ---------------------- | ------------------------ | ----------- | --------- | ----------- |
| `disableUntilComplete` | `disable-until-complete` |             | `boolean` | `true`      |
| `disabled`             | `disabled`               |             | `boolean` | `false`     |
| `keyboardShortcut`     | `keyboard-shortcut`      |             | `string`  | `undefined` |
| `label`                | `label`                  |             | `string`  | `"Submit"`  |


## Events

| Event                      | Description | Type                                                            |
| -------------------------- | ----------- | --------------------------------------------------------------- |
| `registerKeyboardShortcut` |             | `CustomEvent<{ label: string; keys: string; value?: string; }>` |
| `showCorrections`          |             | `CustomEvent<any>`                                              |
| `taskSubmit`               |             | `CustomEvent<any>`                                              |


## Methods

### `refreshSubmitReady() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `setShowCorrections(value: boolean) => Promise<void>`



#### Parameters

| Name    | Type      | Description |
| ------- | --------- | ----------- |
| `value` | `boolean` |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
