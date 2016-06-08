requirejs.config({
    baseUrl: 'js/modules'
});

// Start the main app logic.
requirejs(['render/Render', 'data/Data', 'controller/Control', 'controller/Event', 'utils/Matrix'], function(Render, Data, Control, Event, Matrix) {

    // var a = new Matrix([1,2,3,4,5,6,7,8,9,10,11,12], 3, 4);

    // console.log(a);
    // console.log(a.getValue(2,3));
    // console.log(a.row);
    // console.log(a.colum);
    // console.log(a.source);
    // a.setValue(1,3, 99)
    // console.log(a.getValue(1,3));
    // console.log(a.source);
    // console.log(a.convolution(new Matrix(new Float32Array([1,1,1,1,1,1,1,1,1]), 3, 3)));

    // 一些dom
    var $leftMine = $('#leftMine');
    var $timer = $('#timer');
    var $restart = $('#restart');
    var $gameLevel = $('#gameLevel');
    // 初始化模块
    var data = new Data();
    var render = new Render({
        canvas: document.querySelector('#canvas'),
        level: 0
    });
    var event = new Event();
    var control = new Control(data, render, event);

    var t = 0;
    var timer = null;

    // 监听游戏控制事件
    event.listen('INIT', function(level) {
        var l = level ? level : 0;
        control.level = l;
        control.bind();
        $leftMine.text(data.countMines);
        $timer.text(0);
        clearInterval(timer);
        t = 0;
    });
    event.listen('START', function() {
        timer = setInterval(function() {
            $timer.text(++ t);
        }, 1000);
    });
    event.listen('SUCCESS', function() {
        clearInterval(timer);
        control.unbind();
        t = 0;
        $leftMine.text(0);
        var start = confirm('Congratulations! You win! Once more?');
        if (start) {
            event.trigger('INIT', control.level);
        }
    });
    event.listen('FLAG', function(num) {
        $leftMine.text(num);
    });
    event.listen('FAILURE', function() {
        clearInterval(timer);
        control.unbind();
        t = 0;
        var start = confirm('Sorry, you lose. Try again?');
        if (start) {
            event.trigger('INIT', control.level);
        }
    });

    // 重玩
    $restart.on('click', function() {
        event.trigger('INIT');
    });

    // 设置游戏级别
    $gameLevel.on('click', '[data-level]', function() {
        event.trigger('INIT', +this.getAttribute('data-level'));
    });


});