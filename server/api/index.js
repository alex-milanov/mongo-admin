'use strict';

module.exports = (app, db) => {
	app.route('/api/dbs')
		.get((req, res) => {
			db.db.admin().listDatabases().then(
				list => res.jsonp(list.databases.map(d => d.name)),
				err => res.jsonp(err)
			);
		});
	app.route('/api/dbs/:db')
		.get((req, res) => {
			let t = db.useDb(req.params.db);
			t.db.listCollections().toArray().then(
				list => res.jsonp(list.map(c => c.name)),
				err => res.jsonp(err)
			);
		});
	app.route('/api/dbs/:db/:collection')
		.get((req, res) => {
			let t = db.useDb(req.params.db);
			t.collection(req.params.collection).find().toArray().then(
				list => res.jsonp(list),
				err => res.jsonp(err)
			);
		});
};
