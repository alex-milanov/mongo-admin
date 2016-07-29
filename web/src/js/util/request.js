'use strict';

import {Observable as $} from 'rx';
import superagent from 'superagent';

superagent.Request.prototype.observe = function() {
	return $.fromNodeCallback(this.end, this)();
};

export default superagent;
