'use strict';
// observable interface of superagent
import request from '../../../util/request';
import dom from '../../../util/dom';

const dbSelectEl = document.querySelector('#db-select');
const collectionsEl = document.querySelector('#collections');

const dbNameEl = document.querySelector('#db-name');
const collectionNameEl = document.querySelector('#collection-name');

// const queryEl = document.querySelector('#query');
const resultsEl = document.querySelector('#results');

// fetch the database
request
	.get('http://localhost:8080/api/dbs')
	.observe()
	.map(res => res.body)
	.subscribe(dbs => dbs.forEach(
		dbName => dbSelectEl.appendChild(
			dom.create('option', {
				textContent: dbName,
				value: dbName
			})
		))
	);

// on database select display collections
dom.on(dbSelectEl, 'change', ev => {
	dom.clear(collectionsEl);
	dbNameEl.textContent = dbSelectEl.value;
	collectionNameEl.textContent = '';
	dom.clear(resultsEl);
	if (dbSelectEl.value === '') return false;
	request
		.get(`http://localhost:8080/api/dbs/${dbSelectEl.value}`)
		.observe()
		.map(res => res.body)
		.subscribe(collections => collections.forEach(
			colName => collectionsEl.appendChild(
				dom.create('li', {
					textContent: colName
				})
			))
		);
});

// on collection select(click) display contents/documents
dom.on(collectionsEl, 'click', 'li', ev => {
	collectionNameEl.textContent = ev.target.textContent;
	dom.find(collectionsEl, 'li').forEach(liEl => liEl.classList.remove('active'));
	ev.target.classList.add('active');
	dom.clear(resultsEl);
	request
		.get(`http://localhost:8080/api/dbs/${dbSelectEl.value}/${ev.target.textContent}`)
		.observe()
		.map(res => res.body)
		.subscribe(data => dom.append(resultsEl, [
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
		]));
});
