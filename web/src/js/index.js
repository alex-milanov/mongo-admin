'use strict';

const Rx = require('rx');
const $ = Rx.Observable;

const vdom = require('iblokz').adapters.vdom;

const actions = require('./actions');
const ui = require('./ui');

const state$ = actions.stream
	.scan((state, change) => change(state), {})
	.distinctUntilChanged(state => state);

const ui$ = state$.map(state => ui({state, actions}));

// game loop tick
vdom.patchStream(ui$, '#ui');

window.actions = actions;
