const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const ipc = require('electron').ipcMain;
const mongo = require('iblokz').adapters.mongo;

const db = mongo.connect('mongodb://localhost');

ipc.on('list dbs', ev => {
	db.listDatabases().subscribe(
		list => ev.sender.send('dbs list', list)
	);
});

ipc.on('list collections', (ev, params) => {
	db.use(params.split('/')[1]).listCollections().subscribe(
		list => ev.sender.send('collections list', list)
	);
});

ipc.on('create collections', (ev, params) => {
	const collection = db.use(params.split('/')[1]).connection.collection(params.split('/')[2]);
	collection.save({test: true})
		.then(() => collection.remove({}))
		.then(() => ev.sender.send('collections create', {success: true}));
});

ipc.on('list documents', (ev, params) => {
	db.use(params.split('/')[1]).connection
		.collection(params.split('/')[2]).find().toArray().then(
			list => ev.sender.send('documents list', list)
		);
});

ipc.on('create documents', (ev, params, doc) => {
	const collection = db.use(params.split('/')[1]).connection.collection(params.split('/')[2]);
	collection.save(doc)
		.then(() => ev.sender.send('documents create', {success: true}));
});

ipc.on('update documents', (ev, params, doc) => {
	const collection = db.use(params.split('/')[1]).connection.collection(params.split('/')[2]);
	const newDoc = Object.keys(doc).reduce((o, key) => (key !== '_id')
		? ((o[key] = doc[key]), o)
		: o,
		{}
	);
	collection.update({_id: new mongo.ObjectId(doc._id)}, newDoc)
		.then(() => ev.sender.send('documents update', {success: true}));
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({width: 800, height: 600});

	mainWindow.mongo = mongo;

	// and load the index.html of the app.
	mainWindow.loadURL(`file://${__dirname}/app/index.html`);

	// Open the DevTools.
	mainWindow.webContents.openDevTools();

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function() {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
