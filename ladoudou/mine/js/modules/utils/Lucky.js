define(function () {

    function Lucky (burgeon, seeds) {

        this.burgeon = burgeon;
        this.seeds = seeds;

    }

    Lucky.prototype = {

        constructor: Lucky,

        get lucky () {
            if (this.seeds === 0) {
                return '没有更多的种子了';
            }
            return Math.random() < this.burgeon / this.seeds ? (this.burgeon --, this.seeds --, 1) : (this.seeds --, 0);
        }

    }

    return Lucky;

})