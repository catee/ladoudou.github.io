define(function () {

    var Coordinate = function (width, height, unitSize, rate) {
        this.delta_x = (width - 1) / 2;
        this.delta_y = (height - 1) / 2;
        this.unitSize = unitSize;
        this.mapAreaWidth = 0;
        this.mapAreaHeight = 0;
        this.rate = rate;
    }

    Coordinate.prototype = {

        constructor: Coordinate,

        d2c: function (x, y) {
            return [this.delta_x + x, this.delta_y - y];
        },

        m2c: function (m, n) {
            return this.d2c((this.mapAreaWidth / 2 - n + 1)* this.unitSize * (-1), (this.mapAreaHeight / 2 - m + 1) * this.unitSize);
        },

        c2m: function (x, y) {
            x = x * this.rate;
            y = y * this.rate;
            var m = Math.ceil((y - this.delta_y) / this.unitSize + this.mapAreaHeight / 2 - .1e-7);
            var n = Math.ceil((x - this.delta_x) / this.unitSize + this.mapAreaWidth / 2 - .1e-7);
            if (m < 1 || n < 1 || m > this.mapAreaHeight || n > this.mapAreaWidth) {
                return [0, 0];
            }
            return [m, n];
        },

        setMapArea: function (m, n) {
            this.mapAreaWidth = m;
            this.mapAreaHeight = n;
        }

    }

    return Coordinate;

})