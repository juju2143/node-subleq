// SUBLEQ CPU emulator by juju2143
// Licensed under LiLiQ-P-1.1

module.exports = class subleq
{
    constructor(options)
    {
        options = options || {};

        // Memory
        this.memory = options.memory || 65536;

        // CPU speed in KIPS
        this.kips = options.kips || 1;

        // Registers
        this.dp = options.dp || 0; // Debug pointer
        this.ip = options.ip || 0; // Instruction pointer

        this.debug = !!options.debug;

        this.dumpopts = options.dumpopts || {};
        this.dumpopts.rows = this.dumpopts.rows || 16;
        if(this.dumpopts.rows < 1) this.dumpopts.rows = 1;
        this.dumpopts.cols = this.dumpopts.cols || 16;
        if(this.dumpopts.cols < 1) this.dumpopts.cols = 1;
    }

    // Static cast functions
    static Int16(x){return (new Int16Array([x]))[0]};
    static UInt16(x){return (new Uint16Array([x]))[0]};

    // Get a short in memory
    getInt16(m){return subleq.Int16((this.memory[m%this.memory.length]<<8)+this.memory[(m+1)%this.memory.length])};
    getUInt16(m){return subleq.UInt16((this.memory[m%this.memory.length]<<8)+this.memory[(m+1)%this.memory.length])};

    // Execute one instruction at IP
    step()
    {
        var a = this.getUInt16(this.ip);
        var b = this.getUInt16(this.ip+2);
        var c = this.getUInt16(this.ip+4);
        var ret = [this.ip,a,b,c];
        if(this.debug) console.log(r);

        var ax = this.getInt16(a);
        var bx = this.getInt16(b);

        var r = subleq.Int16(bx-ax);
        var ur = subleq.UInt16(bx-ax);
        this.memory[b%this.memory.length] = ur>>8;
        this.memory[(b+1)%this.memory.length] = ur%256;

        if(r <= 0) this.ip = c;
        else this.ip += 6;

        return ret;
    }

    // Runs step() in a loop
    run()
    {
        if(!this._timeout)
            this._timeout = setInterval(()=>{
                this.step();
            }, 1/this.kips);
    }

    // Stops the loop
    stop()
    {
        if(this._timeout)
            clearInterval(this._timeout);
        this._timeout = null;
    }

    // Dumps memory at the debug pointer
    dump(options)
    {
        options = options || this.dumpopts;
        var str = "";
        for(let i=0;i<options.rows*options.cols;i+=options.cols)
        {
            str += ((this.dp+i)%this.memory.length).toString(16).padStart(4,"0")+": ";
            for(let j=0;j<options.cols;j++)
                str += this.memory[(this.dp+i+j)%this.memory.length].toString(16).padStart(2,"0")+" ";
            str+="\n";
        }
        return str;
    }

    // Set the debug pointer
    get dp()
    {
        return this._dp;
    }
    set dp(x)
    {
        this._dp = x%this.memory.length
    }

    // Set the instruction pointer
    get ip()
    {
        return this._ip;
    }
    set ip(x)
    {
        this._ip = x%this.memory.length
    }

    // Set speed
    get kips()
    {
        return this._kips;
    }
    set kips(x)
    {
        this._kips = x;
        if(this._kips <= 0) this._kips = 1/2147483647;
        if(this._kips > 1) this._kips = 1;
        if(this._timeout)
        {
            this.stop();
            this.run();
        }
    }

    // Set memory
    get memory()
    {
        return this._memory;
    }
    set memory(x)
    {
        if(typeof x == 'number')
        {
            if(x < 6) x = 6;
            if(x > 65536) x = 65536;
        }
        this._memory = new Uint8Array(x);
    }
}