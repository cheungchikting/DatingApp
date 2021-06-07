const knexFile = require('./knexfile').development;
const knex = require('knex')(knexFile);

function socket(io) {

    io.on('connection', (socket) => {
        socket.emit('chat message', 'Start chatting with your match!')

        socket.on("subscribe", (room) => {
            socket.join(room)
        });

        socket.on('chat message', (msg) => {
            io.emit('chat message', msg)
        });







    });

}
module.exports = socket