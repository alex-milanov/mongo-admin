'use strict';

const ObjectID = require('mongodb').ObjectID;

module.exports = (app, db) => {
	app.route('/api/dbs')
		.get((req, res) => {
			db.admin().listDatabases().then(
				list => res.jsonp(list.databases.map(d => d.name)),
				err => res.jsonp(err)
			);
		});
	app.route('/api/dbs/:db')
		.get((req, res) => {
			db.db(req.params.db).listCollections().toArray().then(
				list => res.jsonp(list.map(c => c.name)),
				err => res.jsonp(err)
			);
		})
		.post((req, res) => {
			const collection = db.db(req.params.db).collection(req.body.collection);
			collection.save({test: true})
				.then(() => collection.remove({}))
				.then(
					() => res.jsonp({success: true}),
					err => res.jsonp(err)
				);
		})
		.delete((req, res) => {
			db.db(req.params.db).dropDatabase().then(
				() => res.jsonp({success: true}),
				err => res.jsonp(err)
			);
		});

	app.route('/api/dbs/:db/:collection')
		.get((req, res) => {
			db.db(req.params.db)
				.collection(req.params.collection).find().toArray().then(
					list => res.jsonp(list),
					err => res.jsonp(err)
				);
		})
		// create document
		.post((req, res) => {
			const collection = db.db(req.params.db).collection(req.params.collection);
			collection.save(req.body)
				.then(
					() => res.jsonp({success: true}),
					err => res.jsonp(err)
				);
		})
		.delete((req, res) => {
			db.db(req.params.db).dropCollection(req.params.collection).then(
				() => res.jsonp({success: true}),
				err => res.jsonp(err)
			);
		});

	app.route('/api/dbs/:db/:collection/:documentId')
		.put((req, res) => {
			const collection = db.db(req.params.db).collection(req.params.collection);
			const newDoc = Object.keys(req.body).reduce((o, key) => (key !== '_id')
				? ((o[key] = req.body[key]), o)
				: o,
				{}
			);
			collection.update(
				{_id: new ObjectID(req.body._id)},
				newDoc
			)
				.then(
					() => res.jsonp({success: true}),
					err => res.jsonp(err)
				);
		})
		.delete((req, res) => {
			const collection = db.db(req.params.db).collection(req.params.collection);
			collection.remove({_id: new ObjectID(req.params.documentId)})
				.then(
					() => res.jsonp({success: true}),
					err => res.jsonp(err)
				);
		});
};
