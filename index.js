const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const fs = require('fs');

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/files/index.html');
});

app.get('/file.txt', (req, res) => {
	res.sendFile(__dirname + '/file.txt');
});

io.on('connection', (socket) => {
	msg = fs.readFileSync('./files/file.txt', {encoding: "utf-8"})
	io.emit('update', {msg:msg, status:true});
	socket.on('update', msg => {
		fs.writeFileSync("./files/file.txt", msg)
		io.emit('update', {msg:msg, status:true});
	});
});

http.listen(port, () => {
	console.log(`running on http://localhost:${port}/`);
});
