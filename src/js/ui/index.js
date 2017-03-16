'use strict';

const {
	section, h1, h2, i, select, option, ul, li, header,
	table, tbody, thead, tr, td, th, pre, button, div
} = require('iblokz-snabbdom-helpers');

const content = require('./content');
const leftPane = require('./left-pane');

module.exports = ({state, actions}) => section('#ui', [
	header([
		h1([
			i('.fa.fa-database'),
			' mongoAdmin '
		])
	]),
	leftPane({state, actions}),
	content({state, actions})
]);
