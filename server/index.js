const WebSocket = require('ws');
const crypto = require('crypto');

const server = new WebSocket.Server({ port: 3000 });

const clients = new Map();

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

server.on('connection', socket => {
    const userId = crypto.randomUUID();
    const userColor = getRandomColor();
    clients.set(socket, { userId, userColor });

    socket.send(JSON.stringify({ type: 'color', color: userColor }));

    console.log('Нове з\'єднання.');

    socket.on('message', message => {
        const { userId, userColor } = clients.get(socket);
        // let parsedData;
        // if (message.type === 'Buffer' && Array.isArray(message.data)) {
        //     const buffer = Buffer.from(message.data);
        //     parsedData = buffer.toString('utf-8');
        // } else {
        //     console.error('Помилка: Неправильний формат повідомлення');
        // }
       
        const data = JSON.stringify({ userId, userColor, message });
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data, error => {
                    if (error) {
                        console.error('Помилка надсилання повідомлення:', error);
                    }
                });
            }
        });
    
        console.log(`Повідомлення отримано від ${userId}: ${message}`);
    });
    
    

    socket.on('close', () => {
        clients.delete(socket);
        console.log('З\'єднання закрито.');
    });

    socket.on('error', error => {
        console.error('Помилка WebSocket:', error);
    });
});
