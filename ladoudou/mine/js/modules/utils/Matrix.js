define(['utils/typeChecker'], function (typeChecker) {

    var Matrix = function (array, m, n) {

        if (! (typeChecker.isArray(array) || typeChecker.isFloat32array(array))) {
            throw Error('源数据必须是数组');
        }

        if (m * n !== array.length) {
            throw Error('数组长度不匹配');
        }

        this.source = array;
        this.row = m;
        this.colum = n;

    };

    Matrix.prototype = {

        constructor: Matrix,

        getValue: function (m, n) {

            if (! typeChecker.isInteger(m) || ! typeChecker.isInteger(n)) {
                throw Error('坐标必须是整数');
            }

            if (m < 1 || m > this.row || n < 1 || n > this.colum) {
                throw Error('坐标超出矩阵边界');
            }

            return this.source[n - 1 + (m - 1) * this.colum];

        },

        setValue: function (m, n, newValue) {

            if (! typeChecker.isInteger(m) || ! typeChecker.isInteger(n)) {
                throw Error('坐标必须是整数');
            }

            if (m < 1 || m > this.row || n < 1 || n > this.colum) {
                throw Error('坐标超出矩阵边界');
            }

            var index = n - 1 + (m - 1) * this.colum;
            if (! typeChecker.isUndefined(this.source[index]) && typeChecker.getType(this.source[index]) !== typeChecker.getType(newValue)) {
                throw Error('新值与原值类型不统一');
            }

            this.source[index] = newValue;

        },

        convolution: function (core, property) {

            if (! core instanceof Matrix) {
                throw Error('卷积核必须是 Matrix 类型');
            }

            if (! typeChecker.isFloat32array(core.source)) {
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
                if (! typeChecker.isNumber(value)) {
                    throw Error('模板矩阵的 ' + property + ' 属性必须是数字');
                }
            })

            var row = this.row;
            var colum = this.colum;
            var coreSize = core.row;
            var halfCoreSize = (coreSize - 1) / 2;
            var rowZeroed = row + coreSize - 1;
            var columZeroed = colum + coreSize - 1;
            // var thisZeroed = new Matrix(new Float32Array(rowZeroed * columZeroed), rowZeroed, columZeroed);
            // var result = new Matrix(new Float32Array(row * colum), row, colum);
            var sourceZeroed = new Float32Array(rowZeroed * columZeroed);
            var sourceResult = new Float32Array(row * colum);

            for (var i = 0; i < rowZeroed; i ++) {
                for (var j = 0; j < columZeroed; j ++) {
                    if (i < halfCoreSize || i >= halfCoreSize + row || j < halfCoreSize || j >= halfCoreSize + colum) {
                        // thisZeroed.setValue(i, j, 0.0);
                        sourceZeroed[j + i * columZeroed] = 0.0;
                    } else {
                        // var v = this.getValue(i - halfCoreSize, j - halfCoreSize);
                        // thisZeroed.setValue(i, j, parseFloat(v));
                        var v = source[j - halfCoreSize + (i - halfCoreSize) * colum];
                        sourceZeroed[j + i * columZeroed] = v;
                    }
                }
            }

            var loop_i = row + halfCoreSize;
            var loop_j = colum + halfCoreSize;
            var coreSource = core.source;
            for (var i = halfCoreSize; i < loop_i; i ++) {
                for (var j = halfCoreSize; j < loop_j; j ++) {
                    var _result = 0;
                    for (var m = 0; m < coreSize; m ++) {
                        for (var n = 0; n < coreSize; n ++) {
                            // _result += core.getValue(m, n) * thisZeroed.getValue(i + m - halfCoreSize, j + n - halfCoreSize);
                            _result += coreSource[n + m * coreSize] * sourceZeroed[j + n - halfCoreSize + (i + m - halfCoreSize) * columZeroed];
                        }
                    }
                    // result.setValue(i - halfCoreSize, j - halfCoreSize, _result);
                    sourceResult[j - halfCoreSize + (i - halfCoreSize) * colum] = _result;
                }
            }

            return new Matrix(sourceResult, row, colum);

        }

    }

    return Matrix;

})
