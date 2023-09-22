# task-input-radio



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type      | Default     |
| ------------ | ------------- | ----------- | --------- | ----------- |
| `active`     | `active`      |             | `boolean` | `true`      |
| `answerTag`  | `answer-tag`  |             | `string`  | `"Answer"`  |
| `disabled`   | `disabled`    |             | `boolean` | `false`     |
| `inline`     | `inline`      |             | `boolean` | `undefined` |
| `label`      | `label`       |             | `string`  | `undefined` |
| `labelClass` | `label-class` |             | `string`  | `undefined` |
| `mode`       | `mode`        |             | `string`  | `"radio"`   |
| `name`       | `name`        |             | `string`  | `undefined` |
| `required`   | `required`    |             | `boolean` | `undefined` |


## Events

| Event                      | Description | Type                                                            |
| -------------------------- | ----------- | --------------------------------------------------------------- |
| `inputUpdated`             |             | `CustomEvent<HTMLFormElement>`                                  |
| `registerKeyboardShortcut` |             | `CustomEvent<{ label: string; keys: string; value?: string; }>` |


## Methods

### `getValue() => Promise<string>`



#### Returns

Type: `Promise<string>`



### `readyToSubmit() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`



### `setShowCorrections(value: boolean) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `setValue(value: string) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `validateAgainstAnswer() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`




## Dependencies

### Depends on

- [task-tag](../task-tag)
- [task-button-group](../task-button-group)
- [task-button](../task-button)
- [task-label](../task-label)

### Graph
```mermaid
graph TD;
  task-input-radio --> task-tag
  task-input-radio --> task-button-group
  task-input-radio --> task-button
  task-input-radio --> task-label
  task-button --> task-icon
  style task-input-radio fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
