define(function () {

    function Lucky (red, balls) {

        this.red = red;
        this.balls = balls;

    }

    Lucky.prototype = {

        constructor: Lucky,

        get lucky () {
            if (this.balls === 0) {
                return '没有更多的种子了';
            }
            return Math.random() < this.red / this.balls ? (this.red --, this.balls --, 1) : (this.balls --, 0);
        }

    }

    return Lucky;

})