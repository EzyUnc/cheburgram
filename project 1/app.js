const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

// Укажите свой строку подключения к MongoDB Atlas

const uri = "mongodb+srv://bool:bool@cheburgram.oyjgb.mongodb.net/cheburgram?retryWrites=true&w=majority&appName=cheburgram";

// Подключение к MongoDB
mongoose.connect(uri)
    .then(() => console.log('Подключено к MongoDB'))
    .catch(err => console.error('Ошибка подключения к MongoDB:', err));

// Определение схемы и модели для сообщений
const messageSchema = new mongoose.Schema({
    messageText: String,
    username: String,
    createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Маршрут для получения сообщений
app.get('/get_messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: 1 });
        res.json({ messages });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении сообщений' });
    }
});

// Маршрут для отправки сообщений
app.post('/send_message', async (req, res) => {
    const { messageText, username } = req.body;
    if (!messageText || !username) return res.status(400).json({ success: false });

    try {
        const message = new Message({ messageText, username });
        await message.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Маршрут для очистки сообщений
app.delete('/clear_messages', async (req, res) => {
    console.log('Received request to clear messages');
    try {
        await Message.deleteMany({});
        res.json({ success: true });
    } catch (error) {
        console.error('Ошибка при очистке сообщений:', error);
        res.status(500).json({ success: false });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер запущен на http://0.0.0.0:${PORT}`);
});
