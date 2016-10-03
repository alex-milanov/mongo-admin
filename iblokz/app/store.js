'use strict';

const $ = require('rx').Observable;

const fn = require('../common/fn');

const ipcHook = (ipc, action, resourse, path, data) => {
	ipc.send(`${action} ${resourse}`, path, data);
	return $.create(o => ipc.on(`${resourse} ${action}`, (ev, data) => o.onNext(data)));
};

const init = ({type, agent, url}) => fn.switch(type, {
	http: ({path}) => ({
		list: () => agent.get(`${url}/${path}`).observe().map(res => res.body),
		create: doc => agent.post(`${url}/${path}`).send(doc).observe(),
		read: id => agent.get(`${url}/${path}/${id}`).observe().map(res => res.body),
		update: (id, doc) => agent.put(`${url}/${path}/${id}`).send(doc).observe(),
		delete: id => agent.delete(`${url}/${path}/${id}`).observe()
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
