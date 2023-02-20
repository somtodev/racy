const socket = io()
const chatApp = document.getElementsByTagName('main')[0]
const WELCOME_CONTAINER = document.createElement('section');
const messageForm = document.querySelector('[send-container]')
const messageInput = document.querySelector('[message-input]')
const messageContainer = document.querySelector('[message-container]')
const bodyElement = document.getElementsByTagName('body')[0]
const usersDisplay = document.querySelector('[active-users]')
let toastCount = 0;


window.onload = welcomeUser


function validatedUser(name) {
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
}

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

function welcomeUser() {
    chatApp.style.display = 'none'
    const WELCOME_FORM = document.createElement('form');
    const WELCOME_INPUT = document.createElement('input');
    const WELCOME_BUTTON = document.createElement('button');
    WELCOME_INPUT.setAttribute('placeholder', 'Enter an anonymous name (your choice)')

    WELCOME_BUTTON.textContent = 'Join Chat'
    WELCOME_BUTTON.setAttribute('type', 'submit')


    WELCOME_FORM.append(WELCOME_INPUT, WELCOME_BUTTON)
    WELCOME_CONTAINER.append(WELCOME_FORM)
    bodyElement.append(WELCOME_CONTAINER)

    WELCOME_FORM.addEventListener('submit', (event) => {
        event.preventDefault()
        handleNameInput(WELCOME_INPUT.value)
    })
}


function handleNameInput(name) {

    const validName = validateName(name)

    if (validName) {
        bodyElement.removeChild(WELCOME_CONTAINER)
        chatApp.style.display = 'block'
        validatedUser(name)

    }

}

usersDisplay.textContent = '1'