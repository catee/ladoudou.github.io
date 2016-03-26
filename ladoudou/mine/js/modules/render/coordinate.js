define(function () {

    var Coordinate = function (width, height, unitSize) {
        this.delta_x = (width - 1) / 2;
        this.delta_y = (height - 1) / 2;
        this.unitSize = unitSize;
        this.mapAreaWidth = 0;
        this.mapAreaHeight = 0;
    }

    Coordinate.prototype = {

        constructor: Coordinate,

        d2c: function (x, y) {
            // var argus;
            // switch (arguments.length) {
            //     case 0:
            //         argus = [];
            //     case 1:
            //     case 2:
            //         argus = arguments;
            //         break;
            //     default:
            //         argus = arguments.slice(0, 2);
            // }
            // var x, y;
            // switch (argus.length) {
            //     case 1:
            //         if (typeof arguments[0] === 'array') {
            //             x = arguments[0][0];
            //             y = arguments[0][1];
            //         } else if (typeof arguments[0] === 'number') {
            //             x = arguments[0];
            //             y = 0;
            //         } else {
            //             x = 0;
            //             y = 0;
            //         }
            //         break;
            //     case 2:
            //         if (typeof arguments[0] === 'number') {
            //             x = arguments[0];
            //         } else {
            //             x = 0;
            //         }
            //         if (typeof arguments[1] === 'number') {
            //             y = arguments[1];
            //         } else {
            //             y = 0;
            //         }
            //         break;
            //     case 0:
            //         x = 0;
            //         y = 0;
            //         break;
            //     default:
            //         break;
            // }
            return [this.delta_x + x, this.delta_y - y];
        },

        m2c: function (x, y) {
            return this.d2c((this.mapAreaWidth / 2 - x + 1)* this.unitSize * (-1), (this.mapAreaHeight / 2 - y + 1) * this.unitSize);
        },

        setMapArea: function (cx, cy) {
            this.mapAreaWidth = cx;
            this.mapAreaHeight = cy;
        }



    }

    return Coordinate;

})