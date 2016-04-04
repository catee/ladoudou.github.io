define(function() {
	var clientList = {};

	var Event = function() {};

	Event.prototype = {
		constructor: Event,
		listen: function(key, fn) {
			if (!clientList[key]) {
				clientList[key] = [];
			}
			clientList[key].push(fn);
		},
		trigger: function() {
			var key = Array.prototype.shift.call(arguments);
			var fns = clientList[key];
			if (!fns || fns.length === 0) {
				return false;
			}
			for (var i = 0; i < fns.length; i++) {
				fns[i].apply(this, arguments);
			};
		},
		remove: function(key, fn) {
			var fns = clientList[key];
			if (!fns) {
				return false;
			}
			if (!fn) {
				fns.length = 0;
			} else {
				for (var i = 0; i < fns.length; i++) {
					if (fn === fns[i]) {
						fns.splice(i, 1);
					}
				};
			}
		}
	};

	return Event;
});