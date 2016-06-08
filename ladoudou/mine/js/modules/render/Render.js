define(['utils/typeChecker', 'data/config', 'render/Coordinate'], function (typeChecker, conf, Coor) {

    var level = conf.level;
    var unitSize = conf.unitSize;
    var sourceImage = conf.sourceImage;
    var maps = conf.maps;

    // var requestAnimationFrame = window.requestAnimationFrame;
    // var cancelAnimationFrame = window.cancelAnimationFrame;

    var Render = function (opts) {
        var canvas = this.canvas = opts.canvas;
        this.canvasContext = canvas.getContext('2d');
        var width = this.canvasWidth = canvas.width;
        var height = this.canvasHeight = canvas.height;
        this.coordinateTransition = new Coor(width, height, unitSize, width / canvas.clientWidth);
        this.images = {};
        this.mineAreaWidth = 0;
        this.mineAreaHeight = 0;
        this.Mines = 0;
        this.mineSize = unitSize;
        this.init(opts.level);
    };

    Render.prototype = {

        constructor: Render,

        _paintingLoop: null,

        init: function (level) {
            var self = this;
            this.prepareImages().done(function () {
                self.level = level;
            });
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
            this.mineAreaWidth = arr[1] * this.mineSize;
            this.mineAreaHeight = arr[0] * this.mineSize;
            this.Mines = arr[2];
            this.clearCanvas();
            this.coordinateTransition.setMapArea(arr[1], arr[0]);
            this.paintMap();
        },

        prepareImages: function () {
            var map = this.images.map = new Image();
            var self = this;
            return new $.Deferred(function (deferred) {
                map.onload = function () {
                    deferred.resolve();
                }
                map.src = sourceImage;
            })
        },

        // startPaintingLoop: function () {
        //     this.paintingLoop();
        // },

        // cancelPaintingLoop: function () {
        //     cancelAnimationFrame(this._paintingLoop);
        // },

        // paintingLoop: function () {
        //     var self = this;
        //     this._paintingLoop = requestAnimationFrame(function () {
        //         self.paintOnce();
        //         self._paintingLoop = requestAnimationFrame(arguments.callee);
        //     })
        // },

        // paintCount: function (count) {
        //     if (count < 1) {
        //         return;
        //     }
        //     do {
        //         this.paintOnce();
        //     } while (-- count)
        // },

        // paintOnce: function () {
        //     this.painting();
        // },

        // painting: function () {
        //     console.log(1);
        // },

        paintMap: function () {
            var x = this.mineAreaWidth,
                y = this.mineAreaHeight,
                s = this.mineSize;

            var cx = x / s,
                cy = y / s,
                i = cx * cy;

            if (i <= 0) {
                return;
            }
            do {
                this.paintUnit(Math.ceil(i / cx), i % cx + 1, 'map');
            } while (-- i)

            // var ptrn = ctx.createPattern(map, 'repeat');
            // ctx.fillStyle = ptrn;
            // ctx.fillRect(coo[0], coo[1], width, height);
        },

        paintUnit: function (m, n, type) {
            if (typeChecker.isArray(m)) {
                type = n;
                n = m[1];
                m = m[0];
            }
            if (m < 1 || n < 1 || m > this.mineAreaHeight / this.mineSize || n > this.mineAreaWidth / this.mineSize) {
                return;
            }
            var map = this.images.map,
                ctx = this.canvasContext,
                coorTrans = this.coordinateTransition;
            var s = this.mineSize;
            var pos = maps[type];

            var coo = coorTrans.m2c(m, n);
            ctx.drawImage(map, pos[0], pos[1], pos[2], pos[3], coo[0], coo[1], s, s);
        },

        paint: function (array) {
            array = typeChecker.isArray(array) ? array : [array];
            array.forEach(function (obj) {
                if (obj.flag) {
                    this.paintUnit(obj.m, obj.n, 'flag');
                } else {
                    if (obj.open) {
                        if (obj.mine) {
                            this.paintUnit(obj.m, obj.n, 'mineBoom');
                        } else {
                            this.paintUnit(obj.m, obj.n, 'num' + obj.num);
                        }
                    } else {
                        if (obj.mine) {
                            this.paintUnit(obj.m, obj.n, 'mine');
                        } else {
                            this.paintUnit(obj.m, obj.n, 'map');
                        }
                    }
                }
            }, this);
        },

        clearCanvas: function () {
            this.canvas.width = this.canvasWidth;
        }

    }

    return Render;

})