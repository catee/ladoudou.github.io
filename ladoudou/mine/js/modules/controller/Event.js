define(function() {
	var clientList = {};
	var offlineStack = null;

	var Event = function() {
		offlineStack = [];
	};

	Event.prototype = {
		constructor: Event,
		_listen: function(key, fn) {
			if (!clientList[key]) {
				clientList[key] = [];
			}
			clientList[key].push(fn);
		},
		_trigger: function() {
			var key = Array.prototype.shift.call(arguments);
			var fns = clientList[key];
			if (!fns || fns.length === 0) {
				return false;
			}
			for (var i = 0; i < fns.length; i++) {
				fns[i].apply(this, arguments);
			}
		},
		listen: function() {
			this._listen.apply(this, arguments);
			if (offlineStack) {
				offlineStack.forEach(function(fn, index) {
					fn();
				});
			}
			offlineStack = null;
		},
		trigger: function() {
			var that = this;
			var args = arguments;
			var fn = function() {
				that._trigger.apply(that, args);
			};
			if (offlineStack) {
				return offlineStack.push(fn);
			}
			return fn();
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
				}
			}
		}
	};

	return Event;
});