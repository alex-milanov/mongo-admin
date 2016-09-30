'use strict';

const $ = require('rx').Observable;

const fn = require('../common/fn');

const ipcHook = (ipc, action, resourse, path, data) => {
	ipc.send(`${action} ${resourse}`, path, data);
	return $.fromCallback(ipc.on, `${action} ${resourse} result`, (ev, data) => data);
};

const init = ({type, resource, path, agent}) => fn.switch(type, {
	http: () => ({
		list: () => agent.get(path).observe().map(res => res.body),
		create: doc => agent.post(path).send(doc).observe(),
		read: id => agent.get(`${path}/${id}`).observe().map(res => res.body),
		update: (id, doc) => agent.put(`${path}/${id}`).send(doc).observe(),
		delete: id => agent.delete(`${path}/${id}`).observe()
	}),
	ipc: () => ({
		list: () => ipcHook(agent, 'list', resource, path),
		create: doc => ipcHook(agent, 'create', resource, path, doc),
		read: id => ipcHook(agent, 'read', `${path}/${id}`),
		update: (id, doc) => ipcHook(agent, 'update', `${path}/${id}`, doc),
		delete: id => ipcHook(agent, 'delete', `${path}/${id}`)
	})
})();

module.exports = {
	init
};
