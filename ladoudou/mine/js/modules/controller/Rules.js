define(function() {

	var Rules = function(data, render) {
		this.data = data;
		this.render = render;
	};

	Rules.prototype = {

		constructor: Rules,

		/**
		 * 当前格标记为红旗
		 * @return {[type]} [description]
		 */
		mark: function(offsetX, offsetY) {
			var unit = this._getUnit(offsetX, offsetY);
			if (!unit.open) { // 标志或取消红旗
				var f = unit.flag ? 0 : 1;
				this.data.setFlag(unit.m, unit.n, f);
				this.render.paintUnit(unit.m + 1, unit.n + 1, f ? "flag" : "map");
			}
		},

		/**
		 * 打开当前格子
		 * @return {[type]} [description]
		 */
		open: function(offsetX, offsetY) {
			var unit = this._getUnit(offsetX, offsetY);
			this._openUnit(unit);
		},

		/**
		 * 如果点击数字，且数字和井字区旗数一致，打开周围八格
		 * @return {[type]} [description]
		 */
		quickOpen: function(offsetX, offsetY) {
			var unit = this._getUnit(offsetX, offsetY);
			if (unit.open && unit.num > 0 && !unit.flag && !unit.mine) {
				var neighbors = this._getNeighbors(unit);
				var flags = this._getNeighborsInfo(neighbors, "flag");
				unit.num === flags && this._openNeighbors(neighbors);
			}
		},

		// 打开当前单元格
		_openUnit: function(unit) {
			if (unit.open || unit.flag) { // 已打开或旗帜，不操作
				return;
			} else if (unit.mine) { // 是雷，游戏结束
				this.data.setOpen(unit.m, unit.n);
				// 渲染结束效果，对render返回所有雷的对象数组
				var arr_allmines = this._getAllMines();
				this.render.paint(arr_allmines);
			} else if (unit.num === 0) { // 空白，递归打开周围8格
				this.data.setOpen(unit.m, unit.n);
				this.render.paintUnit(unit.m + 1, unit.n + 1, "num0");
				var neighbors = this._getNeighbors(unit);
				this._openNeighbors(neighbors);
			} else { // 数字，显示
				this.data.setOpen(unit.m, unit.n);
				this.render.paintUnit(unit.m + 1, unit.n + 1, "num" + unit.num);
			}
		},

		// 获取单元格数据
		_getUnit: function(offsetX, offsetY) {
			var coord = this.render.coordinateTransition.c2m(offsetX, offsetY);
			var unit = this.data.data.getValue(coord[0] - 1, coord[1] - 1);
			return unit;
		},

		// 统计周围8格某信息总数
		_getNeighborsInfo: function(units, attribute) {
			var total = 0;
			units.forEach(function(unit, index) {
				unit[attribute] && total++;
			});
			return total;
		},

		// 打开周围8格
		_openNeighbors: function(neighbors) {
			neighbors.forEach(function(unit, index) {
				this._openUnit(unit);
			}, this);
		},

		// 获取周围8格的对象数组
		_getNeighbors: function(unit) {
			var neighbors = [];
			var map = this.data.data;
			var x = unit.m;
			var y = unit.n;
			var tempUnit = null;
			try {
				tempUnit = map.getValue(x - 1, y - 1);
				tempUnit && neighbors.push(tempUnit);
			} catch (e) {}
			try {
				tempUnit = map.getValue(x - 1, y);
				tempUnit && neighbors.push(tempUnit);
			} catch (e) {}
			try {
				tempUnit = map.getValue(x - 1, y + 1);
				tempUnit && neighbors.push(tempUnit);
			} catch (e) {}
			try {
				tempUnit = map.getValue(x, y - 1);
				tempUnit && neighbors.push(tempUnit);
			} catch (e) {}
			// map.getValue(x, y) && neighbors.push(map.getValue(x, y));
			try {
				tempUnit = map.getValue(x, y + 1);
				tempUnit && neighbors.push(tempUnit);
			} catch (e) {}
			try {
				tempUnit = map.getValue(x + 1, y - 1);
				tempUnit && neighbors.push(tempUnit);
			} catch (e) {}
			try {
				tempUnit = map.getValue(x + 1, y);
				tempUnit && neighbors.push(tempUnit);
			} catch (e) {}
			try {
				tempUnit = map.getValue(x + 1, y + 1);
				tempUnit && neighbors.push(tempUnit);
			} catch (e) {}

			return neighbors;
		},

		// 获取所有雷的对象数组
		_getAllMines: function() {
			var mineUnits = [];
			var map = this.data.data;
			map.source.forEach(function(unit, index) {
				unit.mine && mineUnits.push(unit);
			});
			return mineUnits;
		}

	};

	/*	// 数据存储示例
		var data_obj = {
			m: 2,
			n: 6,
			mine: 0,
			num: 2,
			open: 0,
			flag: 1
		};*/

	return Rules;

});