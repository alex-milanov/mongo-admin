'use strict';

import request from './util/request';
import dom from './util/dom';

request
	.get('/api/dbs')
	.observe()
	.map(res => res.body)
	.subscribe(dbs => dbs.forEach(
		dbName => document.querySelector('#db-select').appendChild(
			dom.create('option', {
				textContent: dbName,
				value: dbName
			})
		))
	);

dom.on(document.querySelector('#db-select'), 'change', ev => {
	console.log(ev.target.value);
	dom.clear(document.querySelector('#collections'));
	request
		.get(`/api/dbs/${ev.target.value}`)
		.observe()
		.map(res => res.body)
		.subscribe(collections => collections.forEach(
			colName => document.querySelector('#collections').appendChild(
				dom.create('li', {
					textContent: colName
				})
			))
		);
});
