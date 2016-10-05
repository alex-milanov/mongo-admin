'use strict';

const mongo = require('mongodb');

module.exports = (app, db) => {
	app.route('/api/dbs')
		.get((req, res) => {
			db.listDatabases().subscribe(
				list => res.jsonp(list),
				err => res.jsonp(err)
			);
		});
	app.route('/api/dbs/:db')
		.get((req, res) => {
			db.use(req.params.db).listCollections().subscribe(
				list => res.jsonp(list),
				err => res.jsonp(err)
			);
		})
		.post((req, res) => {
			const collection = db.use(req.params.db).connection.collection(req.body.collection);
			collection.save({test: true})
				.then(() => collection.remove({}))
				.then(
					() => res.jsonp({success: true}),
					err => res.jsonp(err)
				);
		})
		.delete((req, res) => {
			db.use(req.params.db).connection.dropDatabase().then(
				() => res.jsonp({success: true}),
				err => res.jsonp(err)
			);
		});

	app.route('/api/dbs/:db/:collection')
		.get((req, res) => {
			db.use(req.params.db).connection
				.collection(req.params.collection).find().toArray().then(
					list => res.jsonp(list),
					err => res.jsonp(err)
				);
		})
		// create document
		.post((req, res) => {
			const collection = db.use(req.params.db).connection.collection(req.params.collection);
			collection.save(req.body)
				.then(
					() => res.jsonp({success: true}),
					err => res.jsonp(err)
				);
		})
		.delete((req, res) => {
			db.use(req.params.db).connection.dropCollection(req.params.collection).then(
				() => res.jsonp({success: true}),
				err => res.jsonp(err)
			);
		});

	app.route('/api/dbs/:db/:collection/:documentId')
		.put((req, res) => {
			const collection = db.use(req.params.db).connection.collection(req.params.collection);
			const newDoc = Object.keys(req.body).reduce((o, key) => (key !== '_id')
				? ((o[key] = req.body[key]), o)
				: o,
				{}
			);
			collection.update(
				{_id: new mongo.ObjectId(req.body._id)},
				newDoc
			)
				.then(
					() => res.jsonp({success: true}),
					err => res.jsonp(err)
				);
		})
		.delete((req, res) => {
			const collection = db.use(req.params.db).connection.collection(req.params.collection);
			collection.remove({_id: new mongo.ObjectId(req.params.documentId)})
				.then(
					() => res.jsonp({success: true}),
					err => res.jsonp(err)
				);
		});
};
