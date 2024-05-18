const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send("Введіть в url посилання логін Moodle для отримання інформації про студента.");
});

app.get("/is-22fiot-22-066", (req, res) => {
    res.send("Жайворонок Катерина Григорівна, 2 курс, ІС-22");
});

app.listen(port, () => console.log("Server started on port " + port + "."));
