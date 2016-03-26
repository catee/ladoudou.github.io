define(['utils/typeChecker', 'data/config', 'render/coordinate', 'render/animationFrame'], function (typeChecker, conf, Coor) {

    var level = conf.level;
    var unitSize = conf.unitSize;
    var sourceImage = conf.sourceImage;
    var maps = conf.maps;

    var requestAnimationFrame = window.requestAnimationFrame;
    var cancelAnimationFrame = window.cancelAnimationFrame;

    var Render = function (opts) {
        var canvas = this.canvas = opts.canvas;
        this.canvasContext = canvas.getContext('2d');
        var width = this.canvasWidth = canvas.width;
        var height = this.canvasHeight = canvas.height;
        this.coordinateTransition = new Coor(width, height, unitSize);
        this.images = {};
        this.mineAreaWidth = 0;
        this.mineAreaHeight = 0;
        this.Mines = 0;
        this.mineSize = 20; 
        this.init();
    };

    Render.prototype = {

        constructor: Render,

        _paintingLoop: null,

        _deferred: new $.Deferred,

        init: function () {
            var self = this;
            $.when(this._deferred).done(function () {
                self.level = 0;
            });
            this.prepareImages();
        },

        set level (newValue) {
            var arr;
            switch (typeChecker.getType(newValue)) {
                case 'number':
                    if (newValue < 0) {
                        arr = level[0]
                    } else if (newValue < 4) {
                        arr = level[newValue]
                    } else {
                        arr = level[3]
                    }
                    break;
                case 'array':
                    arr = newValue;
                    break;
                default:
                    throw Error('级别必须是0-3，或自定义数组');
            }
            this.mineAreaWidth = arr[0] * this.mineSize;
            this.mineAreaHeight = arr[1] * this.mineSize;
            this.Mines = arr[2];
            this.clearCanvas();
            this.coordinateTransition.setMapArea(arr[0], arr[1]);
            this.paintMap();
        },

        prepareImages: function () {
            var map = this.images.map = new Image();
            var self = this;
            map.onload = function () {
                self._deferred.resolve();
            }
            map.src = sourceImage;
        },

        startPaintingLoop: function () {
            this.paintingLoop();
        },

        cancelPaintingLoop: function () {
            cancelAnimationFrame(this._paintingLoop);
        },

        paintingLoop: function () {
            var self = this;
            this._paintingLoop = requestAnimationFrame(function () {
                self.paintOnce();
                self._paintingLoop = requestAnimationFrame(arguments.callee);
            })
        },

        paintCount: function (count) {
            if (count < 1) {
                return;
            }
            do {
                this.paintOnce();
            } while (-- count)
        },

        paintOnce: function () {
            this.painting();
        },

        painting: function () {
            console.log(1);

            // for (var i = 0; i < (w / size) * (h / size); i ++) {
            //     var x = - (w / 2) + (i % wc) * size;
            //     var y = (h / 2) - Math.floor(i / wc) * size;
            //     this.paintMap(x, y, size, size);
            // }
        },

        paintMap: function () {
            var x = this.mineAreaWidth,
                y = this.mineAreaHeight,
                s = this.mineSize;

            var cx = x / s,
                cy = y / s,
                i = cx * cy - 1;

            if (i <= 0) {
                return;
            }
            do {
                var ox = i % cx + 1;
                var oy = Math.ceil(i / cx + .1e-7);
                this.paintUnit(ox, oy, 'map');
            } while (i --)

            // var ptrn = ctx.createPattern(map, 'repeat');
            // ctx.fillStyle = ptrn;
            // ctx.fillRect(coo[0], coo[1], width, height);
        },

        paintUnit: function (mx, my, type) {
            var map = this.images.map,
                ctx = this.canvasContext,
                coorTrans = this.coordinateTransition;
            var s = this.mineSize;
            var pos = maps[type];

            var coo = coorTrans.m2c(mx, my);
            ctx.drawImage(map, pos[0], pos[1], pos[2], pos[3], coo[0], coo[1], s, s);
        },





        clearCanvas: function () {
            this.canvas.width = this.canvasWidth;
        }

    }

    return Render;

})