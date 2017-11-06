# node-sensortag

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/sandeepmistry/node-sensortag?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


Node.js lib for the [TI SensorTag](http://www.ti.com/tool/cc2541dk-sensor) and [TI CC2650 SensorTag](http://www.ti.com/tool/cc2650stk)

## Prerequisites
 * [for Raspberry Pi Zero] Dowload and install [node] manually the .tar.xz for [ARMv6] from (https://nodejs.org/en/download/)
                           ie.  wget https://nodejs.org/dist/v8.9.0/node-v8.9.0-linux-armv6l.tar.xz
                                sudo tar -C /usr/local --strip-components 1 -xf node-v8.9.0-linux-armv6l.tar.xz
 * [for raspberry install latest node] (https://www.npmjs.com/package/raspberry)
 * [for rapberry-pi upgrade your GCC to V4.8]  (https://github.com/sandeepmistry/noble/issues/253)
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

## Run

```sh
node hackathon.js
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
