const dgram = require('dgram');

module.exports = {
    reqID: 1,
    listeners: [],
    queue: [],
    init(port, address) {
        return {
            ask: (question, callback) => {
                const client = dgram.createSocket('udp4');
                if (this.reqID >= 65535) {
                    this.reqID = 1;
                }
                const thisReqReqID = this.reqID;
                const id = Buffer.alloc(2);
                id.writeUInt16BE(thisReqReqID, 0);
                var q = [Buffer.from([0]), id,  Buffer.from(question)];
                client.send(Buffer.concat(q), 0, Buffer.concat(q).length, port, address, (err) => {
                    if (err) {
                        this.queue.push(q);
                    } else {
                        this.listeners[thisReqReqID] = callback;
                    }
                });
                
                client.on('message', (responseMessage, remote) => {
                    if (this.listeners[thisReqReqID]) {
                        callback(responseMessage, remote);
                    }
                });
                this.reqID++;
            }
        }
    },
}