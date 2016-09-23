'use strict';

module.exports = {
	ui: {
		dom: require('./ui/dom')
	},
	adapters: {
		mongo: require('./adapters/mongo'),
		request: require('./adapters/request'),
		vdom: require('./adapters/vdom')
	},
	common: {
		fn: require('./common/fn'),
		obj: require('./common/obj'),
		str: require('./common/str'),
		cli: require('./common/cli')
	}
};
