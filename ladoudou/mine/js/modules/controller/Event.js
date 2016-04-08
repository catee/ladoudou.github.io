define(function() {

	var Event = function() {
		this.clientList = {};
		this.offlineStack = {}; // 存放先trigger后listen的离线事件函数
	};

	Event.prototype = {
		constructor: Event,
		_listen: function(key, fn) {
			if (!this.clientList[key]) {
				this.clientList[key] = [];
			}
			this.clientList[key].push(fn);
		},
		_trigger: function() {
			var key = Array.prototype.shift.call(arguments);
			var fns = this.clientList[key];
			if (!fns || fns.length === 0) {
				return false;
			}
			for (var i = 0; i < fns.length; i++) {
				fns[i].apply(this, arguments);
			}
		},
		listen: function(key, fn) {
			this._listen.apply(this, arguments);
			// 某事件第一次被listen时，触发对应离线消息
			if (this.offlineStack[key] && this.offlineStack[key].length) {
				this.offlineStack[key].forEach(function(fn, index) {
					fn();
				});
				this.offlineStack[key] = null;
			}
		},
		trigger: function() {
			var that = this;
			var args = arguments;
			var fn = function() {
				that._trigger.apply(that, args);
			};
			// 该事件没有被listen过，则进入离线栈
			var key = args[0];
			if (!this.clientList[key]) {
				if (!this.offlineStack[key]) {
					this.offlineStack[key] = [];
				}
				return this.offlineStack[key].push(fn);
			}
			return fn();
		},
		remove: function(key, fn) {
			var fns = this.clientList[key];
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