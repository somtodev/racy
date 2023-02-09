const socket = io()
const messageForm = document.querySelector('[send-container]')
const messageInput = document.querySelector('[message-input]')
const messageContainer = document.querySelector('[message-container]')
const bodyElement = document.getElementsByTagName('body')[0]
const usersDisplay = document.querySelector('[active-users]')
let toastCount = 0;


let name = prompt("What's your name?")
while (name === '') {
    name = prompt("Come On, Type In Something")
}

notify('You Joined')
socket.emit('new-user', name)

socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', data => {
    notify(`${data.name} connected`)
    usersDisplay.textContent = data.userCount
})

socket.on('user-disconnected', data => {
    notify(`${data.name} disconnected`)
    usersDisplay.textContent = data.userCount
})

messageForm.addEventListener('submit', handleSubmit)

function handleSubmit(event) {
    event.preventDefault()
    const message = messageInput.value

    if (message === '') return

    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', message)
    messageInput.value = ''
}

function appendMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.textContent = message
    messageContainer.append(messageElement)
}

function notify(message) {
    const notificationElement = document.createElement('div')
    notificationElement.classList.add('notification')
    notificationElement.textContent = message
    messageContainer.append(notificationElement)
}

function validateName(name) {
    if (name === '') {
        return false
    }
    return true
}

usersDisplay.textContent = '2'