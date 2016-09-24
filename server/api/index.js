'use strict';

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
		});

	app.route('/api/dbs/:db/:collection')
		.get((req, res) => {
			db.use(req.params.db).connection
				.collection(req.params.collection).find().toArray().then(
					list => res.jsonp(list),
					err => res.jsonp(err)
				);
		})
		.post((req, res) => {
			const collection = db.use(req.params.db).connection.collection(req.params.collection);
			collection.save({test: true})
				.then(() => collection.remove({}))
				.then(
					() => res.jsonp({success: true}),
					err => res.jsonp(err)
				);
		});
};
