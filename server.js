const dgram = require('dgram');

module.exports = {
    init(port, address, callback) {
        const server = dgram.createSocket('udp4');

        server.on('message', (msg, remote) => {
            var data = msg.toJSON().data;
            // Indexing
            // First Byte
            var index = 0;
            var version = data[0];
            // 1st Byte
            var index = 1;
            var reqID = parseInt(Buffer.from([data[index], data[index + 1]]).toString("hex"), 16);
            // 3th Byte
            var index = 3;
            var questionBytes = [];
            for (let i = index; i < data.length; i++) {
                const element = data[i];
                questionBytes.push(element);
            }
            var question = Buffer.from(questionBytes);
            callback({
                question, answer(response) {
                    server.send(Buffer.from(response), 0, Buffer.from(response).length, remote.port, remote.address);
                }
            });
        });
        server.on('listening', () => {
            const address = server.address();
            console.log(`UDP Server listening on ${address.address}:${address.port}`);
        });
        server.on('error', (err) => {
            console.error(`QUANS-Server Error:\n${err.stack}`);
            server.close();
        });

        server.bind(port, address);
    }
}