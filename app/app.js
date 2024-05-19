const socket = new WebSocket('ws://localhost:3000');
let userColor = '';

function sendMessage(e) {
    e.preventDefault();
    const input = document.querySelector('input');
    if(input.value) {
        socket.send(input.value);
        input.value = '';
    }
    input.focus();
}

document.querySelector('form').addEventListener('submit', sendMessage);

// socket.addEventListener('message', ({ data }) => {
//     const reader = new FileReader();
//     reader.onload = function() {
//         const li = document.createElement('li');
//         li.textContent = reader.result;
//         document.querySelector('ul').appendChild(li);
//     };
//     reader.readAsText(data);
// });

socket.addEventListener('message', ({ data }) => {
    const parsedData = JSON.parse(data);
    if (parsedData.type === 'color') {
        userColor = parsedData.color;
    } else {
        const li = document.createElement('li');

        if (parsedData.message.type === 'Buffer' && Array.isArray(parsedData.message.data)) {
            const uint8Array = new Uint8Array(parsedData.message.data);
            const textDecoder = new TextDecoder('utf-8');
            const decodedString = textDecoder.decode(uint8Array);
            li.textContent = `Повідомлення: ${decodedString}`;
        } else {
            li.textContent = parsedData.message;
        }
        
        li.style.color = parsedData.userColor;
        document.querySelector('ul').appendChild(li);
    }
});


socket.onopen = () => {
    console.log("Зв'язок встановлено");
}

