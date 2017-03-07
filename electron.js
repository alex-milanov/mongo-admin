const {app, Menu, BrowserWindow, ipcMain} = require('electron');
const ipc = ipcMain;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017').then(db => {
	ipc.on('list dbs', ev => {
		db.admin().listDatabases().then(
			list => ev.sender.send('dbs list', list.databases.map(d => d.name))
		);
	});

	ipc.on('delete dbs', (ev, params) => {
		db.db(params.split('/')[1]).dropDatabase().then(
			() => ev.sender.send('dbs delete', {success: true})
		);
	});

	ipc.on('list collections', (ev, params) => {
		db.db(params.split('/')[1]).listCollections().toArray().then(
			list => ev.sender.send('collections list', list.map(c => c.name))
		);
	});

	ipc.on('create collections', (ev, params, data) => {
		const collection = db.db(params.split('/')[1]).collection(data.collection);
		collection.save({test: true})
			.then(() => collection.remove({}))
			.then(() => ev.sender.send('collections create', {success: true}));
	});

	ipc.on('delete collections', (ev, params, data) => {
		db.db(params.split('/')[1]).dropCollection(params.split('/')[2])
			.then(() => ev.sender.send('collections delete', {success: true}));
	});

	ipc.on('list documents', (ev, params) => {
		db.db(params.split('/')[1])
			.collection(params.split('/')[2]).find().toArray().then(
				list => ev.sender.send('documents list', list.map(d => JSON.parse(JSON.stringify(d))))
			);
	});

	ipc.on('create documents', (ev, params, doc) => {
		const collection = db.db(params.split('/')[1]).collection(params.split('/')[2]);
		collection.save(doc)
			.then(() => ev.sender.send('documents create', {success: true}));
	});

	ipc.on('update documents', (ev, params, doc) => {
		const collection = db.db(params.split('/')[1]).collection(params.split('/')[2]);
		const newDoc = Object.keys(doc).reduce((o, key) => (key !== '_id')
			? ((o[key] = doc[key]), o)
			: o,
			{}
		);
		collection.update({_id: new ObjectID(doc._id)}, newDoc)
			.then(() => ev.sender.send('documents update', {success: true}));
	});

	ipc.on('delete documents', (ev, params, doc) => {
		const collection = db.db(params.split('/')[1]).collection(params.split('/')[2]);
		collection.remove({_id: new ObjectID(params.split('/')[3])})
			.then(() => ev.sender.send('documents delete', {success: true}));
	});
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({icon: `${__dirname}/assets/icon-48.png`});
	// and load the index.html of the app.
	mainWindow.loadURL(`file://${__dirname}/dist/web/index.html?store=ipc`);

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});

	const template = [
		{
			label: "Application",
			submenu: [
				{label: "About Application", selector: "orderFrontStandardAboutPanel:"},
				{type: "separator"},
				{label: "Quit", accelerator: "Command+Q", click: function() {
					app.quit();
				}}
			]
		}, {
			label: "Edit",
			submenu: [
				{label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:"},
				{label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:"},
				{type: "separator"},
				{label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:"},
				{label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:"},
				{label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:"},
				{label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:"}
			]
		}
	];

	Menu.setApplicationMenu(Menu.buildFromTemplate(template));
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
