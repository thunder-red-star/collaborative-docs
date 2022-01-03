const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const fs = require('fs');

app.get('', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});


function getFiles() {
	files = fs.readdirSync("./files")
	return files
}
filelist = getFiles()
filelist.forEach(file => {
	app.get('/' + file, (req, res) => {
	res.sendFile(__dirname + '/files/' +file);
});
});

io.on('connection', (socket) => {
	socket.on('connected', msg => {
		try {
			doc = fs.readFileSync('./files/' + msg, { encoding: "utf-8" })
		}
		catch {
			doc = ""
		}
		io.emit('update', { msg: doc, status: true, filename: msg });
		io.emit('files', getFiles())
	});
	socket.on('update', msg => {
		fs.writeFileSync("./files/" + msg.filename, msg.msg)
		io.emit('update', { msg: msg.msg, file: msg.filename, status: true });
		io.emit('files', getFiles())
		filelist = getFiles()
		filelist.forEach(file => {
			app.get('/' + file, (req, res) => {
				res.sendFile(__dirname + '/files/' + file);
			});
		});
	});

	socket.on('filechange', msg => {
		try {
			doc = fs.readFileSync('./files/' + msg, { encoding: "utf-8" })
		}
		catch {
			doc = ""
		}
		io.emit('update', { msg: doc, status: true, filename: msg });
		io.emit('files', getFiles())
	});
});

http.listen(port, () => {
	console.log(`running on http://localhost:${port}/`);
});
