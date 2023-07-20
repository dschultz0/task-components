# task-submit



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute                     | Description | Type      | Default     |
| -------------------------- | ----------------------------- | ----------- | --------- | ----------- |
| `disableUntilCompleteMode` | `disable-until-complete-mode` |             | `string`  | `undefined` |
| `disabled`                 | `disabled`                    |             | `boolean` | `false`     |
| `keyboardShortcut`         | `keyboard-shortcut`           |             | `string`  | `undefined` |


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



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
