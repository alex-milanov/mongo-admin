'use strict';

const mongoose = require('mongoose');
const Rx = require('rx');
const $ = Rx.Observable;

let createInterface;

const listDatabases = connection => () => $.fromPromise(
	connection.db.admin().listDatabases()
).map(list => list.databases.map(d => d.name));

const listCollections = connection => () => $.fromPromise(connection.db.listCollections().toArray())
	.map(list => list.map(c => c.name));

const use = connection => dbName => createInterface(connection.useDb(dbName));

const connect = (url, options = {}) => createInterface(
	mongoose.createConnection(url, options)
);

createInterface = connection => ({
	connection,
	listDatabases: listDatabases(connection),
	use: use(connection),
	listCollections: listCollections(connection)
});

module.exports = {
	connect,
	ObjectId: mongoose.Types.ObjectId
};
