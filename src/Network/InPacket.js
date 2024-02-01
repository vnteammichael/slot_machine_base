
var InPacket = cc.Class({
    extends: cc.Component,

    properties: {
        cmdId: 0,
        buffer: null,
        dataView: null,
        offset: 0,
    },

    ctor() {
        // The constructor doesn't initialize the buffer or dataView
        // since they will be set when a message is received.
    },

    // Call this function with the received message buffer
    receiveMessage(buffer) {
        this.buffer = buffer;
        this.dataView = new DataView(this.buffer);
        this.offset = 0;

        this.cmdId = this.dataView.getUint32(this.offset); // Assuming cmdId is a 32-bit integer
        this.offset += 4;
    },

    getInt() {
        let value = this.dataView.getInt32(this.offset);
        this.offset += 4;
        return value;
    },

    getFloat() {
        let value = this.dataView.getFloat32(this.offset);
        this.offset += 4;
        return value;
    },

    getString() {
        let string = '';
        while (this.offset < this.buffer.byteLength) {
            let charCode = this.dataView.getUint8(this.offset++);
            if (charCode === 0) { // Null-terminated string
                break;
            }
            string += String.fromCharCode(charCode);
        }
        return string;
    },
});