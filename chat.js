const socket = io();
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');

function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        // Add user message to chat
        appendMessage('user', message);
        
        // Send message to server
        socket.emit('sendMessage', message);
        
        // Clear input
        messageInput.value = '';
    }
}

// Handle Enter key
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Handle received messages
socket.on('message', function(data) {
    // 显示消息
    appendMessage('AI', data.text);
    
    // 更新表情 - 直接传递代码字符串
    if (data.emotion) {
        console.log('Updating expression with code:', data.emotion);
        window.updateExpression(data.emotion);
    }
});

socket.on('error', (error) => {
    appendMessage('system', `Error: ${error}`);
});

function appendMessage(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = content;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
