const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
var username = 'незнакомец';

window.onload = askNickname;
async function askNickname() {
    var username1 = prompt('Введите ваш никнейм:');
    if (username1 != "" && username1 != null ) {
        alert(`Привет, ${username1}!`);
        username = username1;
    } else alert(`Привет, ${username}!`);
    
    loadMessages()
}
    
    // Запускаем функцию при загрузке страницы

    async function sendMessage() {
        const messageText = messageInput.value;
        if (!messageText || !username) return;

        try {
            const response = await fetch('/send_message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messageText, username }),
            });

            if (!response.ok) throw new Error('Ошибка при отправке сообщения');
            messageInput.value = ''; // Очистка поля ввода
            loadMessages(); // Перезагрузка сообщений
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
        }
        
    }

    async function clearMessages() {
        if (!confirm("Вы действительно хотите очистить все сообщения?")) return;

        try {
            const response = await fetch('/clear_messages', {
                method: 'DELETE', // Убедитесь, что метод DELETE используется
            });

            if (!response.ok) throw new Error('Сеть не отвечает');
            const result = await response.json();
            if (result.success) {
                messagesContainer.innerHTML = ''; // Очистка контейнера на клиенте
            } else {
                console.error('Ошибка при очистке сообщений');
            }
        } catch (error) {
            console.error('Ошибка при очистке сообщений:', error);
        }
    }
document.getElementById('messageInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

async function loadMessages() {
    try {
        const response = await fetch('/get_messages');
        if (!response.ok) throw new Error('Ошибка при получении сообщений');
        const data = await response.json();
        messagesContainer.innerHTML = data.messages.map(msg => `<div>${msg.username}: ${msg.messageText}</div>`).join('');
    } catch (error) {
        console.error('Ошибка при получении сообщений:', error);
    }
}
    // Загрузка сообщений при загрузке страницы
    document.addEventListener('DOMContentLoaded', loadMessages);
