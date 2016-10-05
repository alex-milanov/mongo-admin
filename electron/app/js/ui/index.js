'use strict';

// vex code
const vex = require('vex-js');
vex.registerPlugin(require('vex-dialog'));
vex.defaultOptions.className = 'vex-theme-top';

const {
	section, h1, h2, i, select, option, ul, li,
	table, tbody, thead, tr, td, th, pre, button, div
} = require('iblokz').adapters.vdom;

const content = require('./content');
const leftPane = require('./left-pane');

module.exports = ({state, actions}) => section('#ui', [
	leftPane({state, actions}),
	content({state, actions})
]);
