
const socket = io();
const message = document.getElementById('chat-form')
const textmessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const displayname= document.getElementById('displayname')

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

socket.emit('joinaroom', { username, room })

socket.on('message', (message) => {
    console.log(message);
    func(message)
    textmessages.scrollTop = textmessages.scrollHeight
})

socket.on('roomUsers', ({ room, users }) => {
    display(username);
    roomname(room);
    userslist(users);
});


message.addEventListener('submit', (e) => {
    e.preventDefault()
    var msg = e.target.elements.msg.value
    socket.emit('chatmessage', msg)
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

function func(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML =
        `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text"> ${message.message}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)

}

function roomname(room) {
    roomName.innerHTML = room
}

function userslist(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}

function display(username){
    displayname.innerHTML=username
} 
 