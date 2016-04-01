define(['utils/typeChecker', 'data/DyadicArray', 'data/config', 'utils/Lucky'], function (typeChecker, DyadicArray, config, Lucky) {

    var level = config.level;
    var getType = typeChecker.getType;
    var defineProperties = Object.defineProperties;

    function createUnit (m, n, mine, num) {

        var unit = {
            flag: 0,
            open: 0
        }

        defineProperties(unit, {
            m: {
                value: m,
                writable: false
            },
            n: {
                value: n,
                writable: false
            },
            mine: {
                value: mine,
                writable: false
            },
            num: {
                value: num,
                writable: false
            }
        })

        return unit;
    }

    var MineData = function () {

        this.data = [];
        this.mineMap = null;
        this.countMap = null;
        this.row = 0;
        this.colum = 0;
        this.countMines = 0;
        this.init();

    };

    MineData.prototype = {

        constructor: MineData,

        init: function () {
            this.level = 0;
        },

        set level (newValue) {
            var arr;
            switch (getType(newValue)) {
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
            this.row = arr[0];
            this.colum = arr[1];
            this.countMines = arr[2];
            this.setMineMap();
            this.setCountMap();
            this.setMap();
        },

        setMineMap: function () {
            var row = this.row;
            var colum = this.colum;
            var countMines = this.countMines;
            var mineMap = new DyadicArray(new Array(row * colum), row, colum);
            var lucky = new Lucky(countMines, row * colum);

            for (var i = 0; i < row; i ++) {
                for (var j = 0; j < colum; j ++) {
                    mineMap.setValue(i, j, lucky.lucky);
                }
            }

            this.mineMap = mineMap;
        },

        setCountMap: function () {
            var mineMap = this.mineMap;
            var core = new DyadicArray(new Float32Array([1, 1, 1, 1, 0, 1, 1, 1, 1]), 3, 3);
            var countMap = mineMap.convolution(core);

            this.countMap = countMap;
        },

        setMap: function () {
            var row = this.row;
            var colum = this.colum;
            var mineMap = this.mineMap;
            var countMap = this.countMap;
            var data = new DyadicArray(new Array(row * colum), row, colum);

            for (var i = 0; i < row; i ++) {
                for (var j = 0; j < colum; j ++) {
                    data.setValue(i, j, createUnit(i, j, mineMap.getValue(i, j), countMap.getValue(i, j)));
                }
            }

            this.data = data;
        },

        getAroundMines: function (m, n) {
            if (getType(m) === 'array') {
                n = m[1];
                m = m[0];
            }
            var mineMap = this.mineMap;
            var data = this.data;
            var mines = [];
            var minesNum = this.countMap.getValue(m, n);

            if (minesNum > 0) {
                try { mineMap.getValue(m - 1, n - 1) && mines.push(data.getValue(m - 1, n - 1)); } catch (e) {};
                try { mineMap.getValue(m - 1, n) && mines.push(data.getValue(m - 1, n)); } catch (e) {};
                try { mineMap.getValue(m - 1, n + 1) && mines.push(data.getValue(m - 1, n + 1)); } catch (e) {};
                try { mineMap.getValue(m, n - 1) && mines.push(data.getValue(m, n - 1)); } catch (e) {};
                // mineMap.getValue(m, n) && mines.push(data.getValue(m, n));
                try { mineMap.getValue(m, n + 1) && mines.push(data.getValue(m, n + 1)); } catch (e) {};
                try { mineMap.getValue(m + 1, n - 1) && mines.push(data.getValue(m + 1, n - 1)); } catch (e) {};
                try { mineMap.getValue(m + 1, n) && mines.push(data.getValue(m + 1, n)); } catch (e) {};
                try { mineMap.getValue(m + 1, n + 1) && mines.push(data.getValue(m + 1, n + 1)); } catch (e) {};
            }

            return {
                minesNum: minesNum,
                mines: mines
            }
        },

        setOpen: function (m, n, status) {
            if (getType(m) === 'array') {
                status = n;
                n = m[1];
                m = m[0];
            }
            status = getType(status) === 'undefined' ? 1 : + !! status;
            // console.log(status);
            this.data.getValue(m, n).open = status;
        },

        setFlag: function (m, n, status) {
            if (getType(m) === 'array') {
                status = n;
                n = m[1];
                m = m[0];
            }
            status = getType(status) === 'undefined' ? 1 : + !! status;
            // console.log(status);
            this.data.getValue(m, n).flag = status;
        }

    }

    return MineData;

})