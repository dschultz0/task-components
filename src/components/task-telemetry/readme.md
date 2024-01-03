# task-telemetry



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute            | Description | Type      | Default       |
| ------------------- | -------------------- | ----------- | --------- | ------------- |
| `heartbeatEndpoint` | `heartbeat-endpoint` |             | `string`  | `undefined`   |
| `heartbeatInterval` | `heartbeat-interval` |             | `number`  | `10`          |
| `includeResponse`   | `include-response`   |             | `boolean` | `false`       |
| `localStorageId`    | `local-storage-id`   |             | `string`  | `undefined`   |
| `name`              | `name`               |             | `string`  | `"telemetry"` |
| `submitEndpoint`    | `submit-endpoint`    |             | `string`  | `undefined`   |


## Methods

### `addTimeMeasure(name: string, startMark: string, endMark: string) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `mark(name: string) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `setFetchMethod(func: Function) => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
