define(['controller/Rules'], function(Rules) {

	var Control = function(data, render, event) {
		this._rules = new Rules(data, render, event);
		this.event = event;
		this.ele = render.canvas;
		this.timeout_click = null;
		this.lastclick = 0;
		this.bind();
		this.init();
	};

	Control.prototype = {

		constructor: Control,

		init: function() {
			// 去掉默认的contextmenu事件，否则会和右键事件同时出现
			document.oncontextmenu = function(e) {
				e.preventDefault();
			};
		},

		bind: function() {
			this.handleEvent = this.bindEvent;
			// 绑定鼠标事件
			// 设定事件绑定函数中的this为当前对象 handleEvent
			this.ele.addEventListener("dblclick", this, false);
			this.ele.addEventListener("mousedown", this, false);
			// 初始化规则所需数据
			this._rules.init();
			this.firstClick = true;
		},

		unbind: function() {
			this.handleEvent = null;
		},

		/**
		 * 鼠标双击响应事件
		 */
		onDoubleClick: function(e) {
			this.firstClick && this.event.trigger("START");
			this.firstClick = false;
			// clearTimeout(this.timeout_click);
			// console.log("double click.");
			this._rules.quickOpen(e.offsetX, e.offsetY);
		},


		/**
		 * 鼠标点击响应事件
		 */
		onMouseDown: function(e) {
			var that = this;
			this.firstClick && this.event.trigger("START");
			this.firstClick = false;
			if (e.buttons == 1) { // 单击
				// 为了保证单击不时延，允许双击时执行一次单击（功能不冲突）
				var t = new Date().getTime();
				if (t - that.lastclick < 300) {
					return;
				}
				that.lastclick = t;
				// // 单击事件延迟执行，保证双击时不执行单击
				// clearTimeout(this.timeout_click);
				// this.timeout_click = setTimeout(function() {
				// console.log("left click.");
				that._rules.open(e.offsetX, e.offsetY);
				// }, 300);
			}
			if (e.buttons == 2) { // 右键单击
				// console.log("right click.");
				this._rules.mark(e.offsetX, e.offsetY);
			}
			if (e.buttons == 3) { // 左右键一起点击
				// clearTimeout(this.timeout_click);
				// console.log("left & right click.");
				this._rules.quickOpen(e.offsetX, e.offsetY);
			}
		},

		handlers: {
			dblclick: function(e) {
				this.onDoubleClick(e);
			},
			mousedown: function(e) {
				this.onMouseDown(e);
			}
		},

		bindEvent: function(e) {
			this.handlers[e.type] && this.handlers[e.type].call(this, e);
		}

	};

	return Control;

});