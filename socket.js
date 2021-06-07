let redis = require("redis");
let client = redis.createClient({
  host: 'localhost',
  port: 6379
});

function socket(io) {
    io.on('connection', (socket) => {

        let chatroom = null;

        socket.on("subscribe", (roomid) => {
            chatroom = roomid
            socket.join(roomid)
            io.to(chatroom).emit('joinroom');
           
        });

        socket.on('chat message', (msg) => {
            client.rpush(chatroom, JSON.stringify({'user': msg.user, 'msg': msg.msg}))
            io.to(chatroom).emit('chat message', msg)
        });

    });

}
module.exports = socket