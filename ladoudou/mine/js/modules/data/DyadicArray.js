define(['utils/typeChecker'], function (typeChecker) {

    var getType = typeChecker.getType;

    var DyadicArray = function (array, m, n) {

        if (getType(array) !== 'array' && getType(array) !== 'float32array') {
            throw Error('源数据必须是数组');
        }

        if (m * n !== array.length) {
            throw Error('数组长度不匹配');
        }

        this.source = array;
        this.row = m;
        this.colum = n;

    };

    DyadicArray.prototype = {

        constructor: DyadicArray,

        getValue: function (x, y) {

            if (x < 0 || x > (this.row - 1) || y < 0 || y > (this.colum - 1)) {
                throw Error('坐标超出矩阵边界');
            }

            return this.source[y + x * this.colum];

        },

        setValue: function (x, y, newValue) {

            if (x < 0 || x > (this.row - 1) || y < 0 || y > (this.colum - 1)) {
                throw Error('坐标超出矩阵边界');
            }

            var index = y + x * this.colum;
            if (getType(this.source[index]) !== getType(newValue)) {
                throw Error('新值与原值类型不统一');
            }

            this.source[index] = newValue;

        },

        convolution: function (core, property) {

            if (! core instanceof DyadicArray) {
                throw Error('卷积核必须是 DyadicArray 类型');
            }

            if (getType(core.source) !== 'float32array') {
                throw Error('卷积核必须是类型化数组 Float32Array');
            }

            if (core.row !== core.colum) {
                throw Error('卷积核必须是方阵');
            }

            if (core.row % 2 === 0) {
                throw Error('卷积核必须是奇数阶方阵');
            }

            var source = this.source;
            var paths = property ? property.split('.') : [];
            source.forEach(function (s_item) {
                var value = s_item;
                paths.forEach(function (p_item) {
                    if (! p_item in value) {
                        throw Error('找不到属性' + p_item);
                    }
                    value = value[s_item];
                })
                if (getType(value) !== 'number') {
                    throw Error('模板矩阵的 ' + property + ' 属性必须是数字');
                }
            })

            var row = this.row;
            var colum = this.colum;
            var coreSize = core.row;
            var halfCoreSize = (coreSize - 1) / 2;
            var rowZeroed = row + coreSize - 1;
            var columZeroed = colum + coreSize - 1;
            var thisZeroed = new DyadicArray(new Float32Array(rowZeroed * columZeroed), rowZeroed, columZeroed);
            var result = new DyadicArray(new Float32Array(row * colum), row, colum);

            for (var i = 0; i < rowZeroed; i ++) {
                for (var j = 0; j < columZeroed; j ++) {
                    if (i < halfCoreSize || i >= halfCoreSize + row || j < halfCoreSize || j >= halfCoreSize + colum) {
                        thisZeroed.setValue(i, j, 0.0);
                    } else {
                        var v = this.getValue(i - halfCoreSize, j - halfCoreSize);
                        thisZeroed.setValue(i, j, parseFloat(v));
                    }
                }
            }

            for (var i = halfCoreSize; i < row + halfCoreSize; i ++) {
                for (var j = halfCoreSize; j < colum + halfCoreSize; j ++) {
                    var _result = 0;
                    for (var m = 0; m < coreSize; m ++) {
                        for (var n = 0; n < coreSize; n ++) {
                            _result += core.getValue(m, n) * thisZeroed.getValue(i + m - halfCoreSize, j + n - halfCoreSize);
                        }
                    }
                    result.setValue(i - halfCoreSize, j - halfCoreSize, _result);
                }
            }

            return result;

        }

    }

    return DyadicArray;

})
