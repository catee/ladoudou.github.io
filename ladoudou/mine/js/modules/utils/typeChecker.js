define(function () {

    var OP = Object.prototype;

    var TypeChecker = function () {

    };

    TypeChecker.prototype = {

        constructor: TypeChecker,

        getType: function (arg) {
            return /^\[object\s(.*)]$/.exec(OP.toString.call(arg))[1].toLowerCase();
        },

        isNumber: function (arg) {
            return this.getType(arg) === 'number';
        },

        isInteger: function (arg) {
            return this.isNumber(arg) && arg | 0 === arg;
        },

        isArray: function (arg) {
            return this.getType(arg) === 'array';
        },

        isFloat32array: function (arg) {
            return this.getType(arg) === 'float32array';
        },

        isFloat64array: function (arg) {
            return this.getType(arg) === 'float64array';
        },

        isString: function (arg) {
            return this.getType(arg) === 'string';
        },

        isFunction: function (arg) {
            return this.getType(arg) === 'function';
        },

        isRegexp: function (arg) {
            return this.getType(arg) === 'regexp';
        },

        isPromise: function (arg) {
            return this.getType(arg) === 'promise';
        },

        isDate: function (arg) {
            return this.getType(arg) === 'date';
        },

        isNull: function (arg) {
            return this.getType(arg) === 'null';
        },

        isUndefined: function (arg) {
            return this.getType(arg) === 'undefined';
        }

        // isNaN: function (arg) {
        //     return this.getType(arg) === 'nan';
        // }

        // isObject: function (arg) {
        //     return this.getType(arg) === 'object';
        // }

    };

    return new TypeChecker();

})