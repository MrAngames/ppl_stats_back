const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

const serverIP = '34.pepeland.net'; // Замените на IP вашего сервера
const apiUrl = `https://api.mcsrvstat.us/2/${serverIP}`;

let onlineData = [];
let timeData = [];

app.use(cors());

// Обслуживание статических файлов из папки "public"
app.use(express.static(path.join(__dirname, 'public')));

async function fetchData() {
    try {
        const response = await axios.get(apiUrl);
        const playerCount = response.data.players.online;

        let now = new Date();
        onlineData.push(playerCount);
        timeData.push(now.toLocaleTimeString());

        if (onlineData.length > 60) {
            onlineData.shift();
            timeData.shift();
        }

        console.log(`Player count: ${playerCount}`);
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

// Эндпоинт для предоставления данных на фронтенд
app.get('/data', (req, res) => {
    res.json({
        online: onlineData,
        time: timeData
    });
});

// Запрос к API каждые 15 минут
setInterval(fetchData, 1 * 60 * 1000);

// Первый вызов, чтобы сразу получить данные
fetchData();

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
