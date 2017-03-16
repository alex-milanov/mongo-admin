'use strict';

// vex code
const vex = require('vex-js');
vex.registerPlugin(require('vex-dialog'));
vex.defaultOptions.className = 'vex-theme-top';

const Rx = require('rx');
const $ = Rx.Observable;

const vdom = require('iblokz-snabbdom-helpers');

// app
const app = require('./util/app');
let actions = require('./actions');
let ui = require('./ui');

// prep actions
let actions$ = new Rx.Subject();
actions = app.adapt(actions);
actions.stream.subscribe(actions$);
console.log(actions);

// hot reloading
if (module.hot) {
	// actions
	$.fromEventPattern(
    h => module.hot.accept("./actions", h)
	)
		.subscribe(() => {
			actions = app.adapt(require('./actions'));
			actions.stream.subscribe(actions$);
			actions$.onNext(state => state);
		});
	// ui
	module.hot.accept("./ui", function() {
		ui = require('./ui');
		actions$.onNext(state => state);
	});
}

actions.dbs.list();

// actions -> state
const state$ = actions$
	.startWith(() => actions.initial)
	.scan((state, change) => change(state), {})
	.map(state => (console.log(state), state))
	.share();

// hooks
// on db change list collections
state$
	.distinctUntilChanged(state => state.selection && state.selection.db)
	.subscribe(state => actions.collections.list(state.selection.db));
// on collection change list documents
state$
	.distinctUntilChanged(state => state.selection && state.selection.collection)
	.subscribe(state => actions.documents.list(state.selection.db, state.selection.collection));

const ui$ = state$.map(state => ui({state, actions}));

// game loop tick
vdom.patchStream(ui$, '#ui');

window.actions = actions;
