const socket = io()
const messageForm = document.querySelector('[send-container]')
const messageInput = document.querySelector('[message-input]')
const messageContainer = document.querySelector('[message-container]')
const bodyElement = document.getElementsByTagName('body')[0]
let toastCount = 0;

const name = prompt("What's your name?")
notify('You Joined')
socket.emit('new-user', name)

socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
    notify(`${name} connected`)
})

socket.on('user-disconnected', name => {
    notify(`${name} disconnected`)
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