'use strict';

const $ = require('rx').Observable;

const {fn} = require('iblokz-data');

const storeType = (window.location.search.match(/store=([a-z]+)/i) || ['http']).pop();

const getAgent = type => (type === 'ipc')
	? window.require('electron').ipcRenderer
	: require('superagent');

const baseUrl = `${window.location.origin}/api`;

const ipcHook = (ipc, action, resourse, path, data) => {
	ipc.send(`${action} ${resourse}`, path, data);
	return $.create(o => ipc.on(`${resourse} ${action}`, (ev, data) => o.onNext(data)));
};

const init = ({type, agent, url} = {type: storeType, agent: getAgent(storeType), url: baseUrl}) =>
	fn.switch(type, {
		http: ({path}) => ({
			list: () => $.fromPromise(agent.get(`${url}/${path}`).then(res => res.body)),
			create: doc => $.fromPromise(agent.post(`${url}/${path}`).send(doc).then(res => res.body)),
			read: id => $.fromPromise(agent.get(`${url}/${path}/${id}`).then(res => res.body)),
			update: (id, doc) => $.fromPromise(agent.put(`${url}/${path}/${id}`).send(doc).then(res => res.body)),
			delete: id => $.fromPromise(agent.delete(`${url}/${path}/${id}`).then(res => res.body))
		}),
		ipc: ({resource, path}) => ({
			list: () => ipcHook(agent, 'list', resource, path),
			create: doc => ipcHook(agent, 'create', resource, path, doc),
			read: id => ipcHook(agent, 'read', resource, `${path}/${id}`),
			update: (id, doc) => ipcHook(agent, 'update', resource, `${path}/${id}`, doc),
			delete: id => ipcHook(agent, 'delete', resource, `${path}/${id}`)
		})
	});

module.exports = {
	init
};
