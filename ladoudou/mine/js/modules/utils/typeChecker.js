define(function () {

    var OP = Object.prototype;

    var TypeChecker = function () {

    };

    TypeChecker.prototype = {

        constructor: TypeChecker,

        getType: function (arg) {

            return /^\[object\s(.*)]$/.exec(OP.toString.call(arg))[1].toLowerCase();

        }

    };

    // return {

    //     getTypeChecker: function () {
    //         var tc;
    //         return (function () {
    //             return tc ? tc : (tc = new TypeChecker());
    //         })()
    //     }

    // }

    return new TypeChecker();

})