let socket = io();

window.addEventListener('load', (event) => {
    let id = document.getElementById('chat-title').getAttribute("data-id")
    socket.emit("subscribe", id);

    let form = document.getElementById('form');
    let input = document.getElementById('input');
    let username

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        username = document.getElementById('chat-title').getAttribute("data-user")
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
        console.log(msg.user)
        if(msg.user == username){
            $("#chat-message-list").append(
                `<div class="message-row you-message">
                    <div class="message-content">
                        <div class="message-text">${msg.msg}</div>
                    </div>
                </div>`
            )
        } else {
            console.log('hit me')
            $("#chat-message-list").append(
                `<div class="message-row other-message">
                <div class="message-content">
                    <div class="message-title">
                 ${msg.user}
                    </div>
                    <!-- <img src="https://thoughtcatalog.com/wp-content/uploads/2018/05/questionstoaskagirl2.jpg?w=1920&h=1280&crop=1" alt=""> -->
                    <div class="message-text" id="othermsg" >${msg.msg}</div>
                </div>
            </div>`
            )
        }

        window.scrollTo(0, document.body.scrollHeight);
    });

})