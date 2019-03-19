const subleq = require('../lib/subleq');

var cpu = new subleq({
    memory: 65536,
    kips: 1,
    ip: 0,
    dp: 0,
    debug: false,
    dumpopts: {
        rows: 16,
        cols: 16,
    },
});

cpu.memory[1] = 4;
cpu.memory[5] = 6;
console.log(cpu.dump());

cpu.run();

setTimeout(()=>{
    cpu.stop();
    console.log(cpu.dump({rows:8, cols:8}));
}, 2000);