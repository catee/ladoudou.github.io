define(['controller/Rules'], function(Rules) {
	var _rules = null;

	var Control = function(data, render) {
		_rules = new Rules(data, render);
		this.timeout_click = null;
		this.bind(render.canvas);
	};

	Control.prototype = {

		constructor: Control,

		bind: function(ele) {
			// 去掉默认的contextmenu事件，否则会和右键事件同时出现
			document.oncontextmenu = function(e) {
				e.preventDefault();
			};
			// 绑定鼠标事件
			// 设定事件绑定函数中的this为当前对象 handleEvent
			$(ele)[0].addEventListener("dblclick", this, false);
			$(ele)[0].addEventListener("mousedown", this, false);
			// $(ele).bind("dblclick", this.onDoubleClick);
			// $(ele).bind("mousedown", this.onMouseDown);
		},

		/**
		 * 鼠标双击响应事件
		 */
		onDoubleClick: function(e) {
			clearTimeout(this.timeout_click);
			console.log("double click.");
			_rules.quickOpen(e.offsetX, e.offsetY);
		},

		/**
		 * 鼠标点击响应事件
		 */
		onMouseDown: function(e) {
			if (e.buttons == 1) { // 单击
				clearTimeout(this.timeout_click);
				this.timeout_click = setTimeout(function() {
					console.log("left click.");
					_rules.open(e.offsetX, e.offsetY);
				}, 300);
			}
			if (e.buttons == 2) { // 右键单击
				console.log("right click.");
				_rules.mark(e.offsetX, e.offsetY);
			}
			if (e.buttons == 3) { // 左右键一起点击
				clearTimeout(this.timeout_click);
				console.log("left & right click.");
				_rules.quickOpen(e.offsetX, e.offsetY);
			}
		},

		handlers: {
			dblclick: function (e) {
				this.onDoubleClick(e);
			},
			mousedown: function (e) {
				this.onMouseDown(e);
			}
		},

		handleEvent: function (e) {
			this.handlers[e.type] && this.handlers[e.type].call(this, e);
		}

	};

	return Control;

});