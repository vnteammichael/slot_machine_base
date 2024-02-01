

var OutPacket = cc.Class({
    extends: cc.Component,

    properties: {
        cmdId: 0,
        buffer: null,
        dataView: null,
        offset: 0
    },

    ctor() {
        this.buffer = new ArrayBuffer(1024); // Adjust size as needed
        this.dataView = new DataView(this.buffer);
        this.offset = 0; // Tracks the current position in the buffer
    },

    setCmdId(cmdId) {
        this.cmdId = cmdId;
        this.dataView.setUint32(this.offset, this.cmdId); // Assuming cmdId is a 32-bit integer
        this.offset += 4; // Increment offset by the size of cmdId
    },

    putInt(value) {
        this.dataView.setInt32(this.offset, value);
        this.offset += 4; // Increment offset by the size of the integer
    },

    putFloat(value) {
        this.dataView.setFloat32(this.offset, value);
        this.offset += 4; // Increment offset by the size of the float
    },

    putString(value) {
        for (let i = 0; i < value.length; i++) {
            this.dataView.setUint8(this.offset++, value.charCodeAt(i));
        }
        this.dataView.setUint8(this.offset++, 0); // Null-terminated string
    },

    pack() {
        return this.buffer.slice(0, this.offset); // Return the relevant part of the buffer
    },
});