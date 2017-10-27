# node-sensortag

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/sandeepmistry/node-sensortag?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


Node.js lib for the [TI SensorTag](http://www.ti.com/tool/cc2541dk-sensor) and [TI CC2650 SensorTag](http://www.ti.com/tool/cc2650stk)

## Prerequisites

 * [node-gyp install guide](https://github.com/nodejs/node-gyp#installation)
 * [noble prerequisites](https://github.com/sandeepmistry/noble#prerequisites)

## Install

```sh
npm install sensortag
```

## Config

```sh
cp localdb.json.example localdb.json
```

Edit with platform credentials:

```sh
vi localdb.json
```


## Examples

See [test.js](test.js) or [sensorTag folder in Tom Igoe's BluetoothLE-Examples repo ](https://github.com/tigoe/BluetoothLE-Examples/tree/master/sensorTag)

CC2540:

```javascript
sensorTag.on('simpleKeyChange', callback(left, right));
```

CC2650:

```javascript
sensorTag.on('simpleKeyChange', callback(left, right, reedRelay));
```
