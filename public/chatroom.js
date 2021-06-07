let socket = io();

window.addEventListener('load', (event) => {
    let id = document.getElementById('echo').getAttribute("data-id")
    socket.emit("subscribe", id);

    let messages = document.getElementById('messages');
    let form = document.getElementById('form');
    let input = document.getElementById('input');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let username = document.getElementById('echo').getAttribute("data-user")
        let object = {
            user: username,
            msg: input.value
        }
        if (input.value) {
            socket.emit('chat message', object);
            input.value = '';
        }
    });

    socket.on('chat message', function (msg) {
        let item = document.createElement('li');
        item.textContent = `${msg.user}: ${msg.msg}`;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);

    });

    socket.on("joinroom", () => {
        echo.innerHTML = `Start chatting with your match!`

    });
})