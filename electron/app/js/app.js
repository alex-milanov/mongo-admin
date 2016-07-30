'use strict';

const $ = require('rx').Observable;
// observable interface of superagent
const request = require('./util/request');
const dom = require('./util/dom');

const ipc = require('electron').ipcRenderer;

// db.connection.on('error', console.error.bind(console, 'connection error:'));
// db.connection.once('open', function() {
// 	console.log('Connected to mongoDB');
// });

// .db.listCollections().toArray().then(
// 	list => console.log(list),
// 	err => console.log(err)
// ));

const dbSelectEl = document.querySelector('#db-select');
const collectionsEl = document.querySelector('#collections');

const dbNameEl = document.querySelector('#db-name');
const collectionNameEl = document.querySelector('#collection-name');

// const queryEl = document.querySelector('#query');
const resultsEl = document.querySelector('#results');

// fetch the database
ipc.on('databases list',
	(ev, dbs) => dbs.forEach(
		dbName => dbSelectEl.appendChild(
			dom.create('option', {
				textContent: dbName,
				value: dbName
			})
		))
);

ipc.send('list databases');

// on database select display collections
ipc.on('collections list', (ev, collections) => collections.forEach(
	colName => collectionsEl.appendChild(
		dom.create('li', {
			textContent: colName
		})
	))
);

dom.on(dbSelectEl, 'change', ev => {
	dom.clear(collectionsEl);
	dbNameEl.textContent = dbSelectEl.value;
	collectionNameEl.textContent = '';
	dom.clear(resultsEl);
	if (dbSelectEl.value === '') return false;
	ipc.send('list collections', dbSelectEl.value);
});

// on collection select(click) display contents/documents
ipc.on('request executed',
	(ev, data) => dom.append(resultsEl, [
		dom.append(dom.create('thead'), [
			dom.append(dom.create('tr'),
				Object.keys(data.reduce((m, o) => Object.assign(m, o), {}))
					.map(field => dom.create('th', {textContent: field}))
			)
		]),
		dom.append(dom.create('tbody'), data.map(
			doc => dom.append(dom.create('tr'), Object.keys(doc).map(
				field => dom.create('td', {textContent: doc[field]})
			))
		))
	])
);

dom.on(collectionsEl, 'click', 'li', ev => {
	collectionNameEl.textContent = ev.target.textContent;
	dom.find(collectionsEl, 'li').forEach(liEl => liEl.classList.remove('active'));
	ev.target.classList.add('active');
	dom.clear(resultsEl);
	ipc.send('exec request', dbSelectEl.value, ev.target.textContent);
});
