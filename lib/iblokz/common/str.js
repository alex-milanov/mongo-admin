'use strict';

const toCamelCase = (str, glue) =>
	str.split(glue || '_')
		.map((chunk, i) => (i === 0)
			? chunk
			: chunk.charAt(0).toUpperCase() + chunk.slice(1))
		.join('');

const fromCamelCase = (str, glue) =>
	str.replace(/([A-Z])/g, ' $1')
		.split(' ')
		.map(chunk => chunk.toLowerCase())
		.join(glue || '_');

const singularToPlural = str =>
	str.replace(/y$/, 'ie').concat('s');

const pluralToSingular = str =>
	str.replace(/ies$/, 'y').replace(/s$/, '');

const toDocumentId = str => ':'.concat(pluralToSingular(toCamelCase(str, '-')), 'Id');

module.exports = {
	toCamelCase,
	fromCamelCase,
	singularToPlural,
	pluralToSingular,
	toDocumentId
};
