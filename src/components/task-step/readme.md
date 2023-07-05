# task-step



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type      | Default     |
| -------- | --------- | ----------- | --------- | ----------- |
| `active` | `active`  |             | `boolean` | `undefined` |
| `label`  | `label`   |             | `string`  | `undefined` |


## Events

| Event               | Description | Type                    |
| ------------------- | ----------- | ----------------------- |
| `cardClicked`       |             | `CustomEvent<TaskStep>` |
| `cardReadyToSubmit` |             | `CustomEvent<boolean>`  |


## Methods

### `readyToSubmit() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`




## Dependencies

### Depends on

- [task-icon](../task-icon)

### Graph
```mermaid
graph TD;
  task-step --> task-icon
  style task-step fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
