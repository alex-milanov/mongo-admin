'use strict';

const compose = (...fList) => (...args) => fList.reduce(
	(r, f) => (r instanceof Array) && f.apply(null, r) || f(r), args
);

const _switch = (value, cases) => (typeof cases[value] !== 'undefined')
	&& cases[value] || cases['default'] || false;

module.exports = {
	compose,
	switch: _switch
};
