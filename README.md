# node-subleq

# Features

- One instruction 16-bit CPU
- 16-bit addressing
- Up to 64k RAM
- RAM dumper

# API

## Getting started

```js
const subleq = require('subleq');

var cpu = new subleq({ // Every of these options are optional and are available as a property
    memory: 65536, // Amount of memory to give the VM, either an integer between 6 and 65536 or an array
    kips: 1, // Kiloinstructions per seconds the VM should run at, only ]0, 1] currently supported
    ip: 0, // Starting value for the instruction pointer
    dp: 0, // Starting value for the debug pointer
    debug: false, // step() also console.log some debug info
    dumpopts: { // default options for dump()
        rows: 16, // number of lines to return
        cols: 16, // number of bytes per line
    },
});
```

## step()

## run()

## stop()

## dump(options)

## getInt16(m)

## getUInt16(m)

## static Int16(x)

## static UInt16(x)