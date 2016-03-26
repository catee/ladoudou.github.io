define(['utils/typeChecker'], function (typeChecker) {

    var getType = typeChecker.getType;

    var DyadicArray = function (array, m, n) {

        if (getType(array) !== 'array') {
            throw Error('源数据必须是数组');
        }

        if (m * n !== array.length) {
            throw Error('数组长度不匹配');
        }

        this.source = array;
        this.row = n;
        this.colum = m;

    };

    DyadicArray.prototype = {

        constructor: DyadicArray,

        getValue: function (x, y) {

            if (x < 0 || x > (this.colum - 1) || y < 0 || y > (this.row - 1)) {
                throw Error('坐标超出矩阵边界');
            }

            return this.source[x + y * this.colum];

        },

        setValue: function (x, y, newValue) {

            if (x < 0 || x > (this.colum - 1) || y < 0 || y > (this.row - 1)) {
                throw Error('坐标超出矩阵边界');
            }

            var index = x + y * this.colum;
            if (getType(this.source[index]) !== getType(newValue)) {
                throw Error('新值与原值类型不统一');
            }

            this.source[index] = newValue;

        },

        convolution: function (core, property) {

            if (! core instanceof DyadicArray) {
                throw Error('卷积核必须是 DyadicArray 类型');
            }

            if (/^float(32)|(64)array$/i.test(getType(core.source))) {
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
                        throw Error('属性名称不匹配');
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
            var rowZeroed = row + coreSize - 1;
            var columZeroed = colum + coreSize - 1;
            var lengthZeroed = rowZeroed * columZeroed;
            var sourceZeroed = new Float32Array(lengthZeroed);



        }

    }

    return DyadicArray;

})