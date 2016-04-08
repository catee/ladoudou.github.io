requirejs.config({
    baseUrl: 'js/modules'
});

// Start the main app logic.
requirejs(['render/Render', 'data/DyadicArray', 'data/Data', 'controller/Control', 'controller/Event'], function(Render, DyadicArray, Data, Control, Event) {

    // 初始化模块
    var data = new Data();
    var render = new Render({
        canvas: document.querySelector('#canvas')
    });
    var event = new Event();
    var control = new Control(data, render, event);

    var t = 0;
    var timer = null;

    // 监听游戏控制事件
    event.listen("INIT", function(level) {
        var l = level ? level : +$("#gameLevel")[0].value || 0;
        data.level = l;
        render.level = l;
        control.bind();
        $("#leftMine").html(data.countMines);
        $("#timing").html(0);
        clearInterval(timer);
        t = 0;
    });
    event.listen("START", function() {
        timer = setInterval(function() {
            if (t < 999) {
                $("#timing").html(++t);
            } else {
                clearInterval(timer);
            }
        }, 1000);
    });
    event.listen("SUCCESS", function() {
        clearInterval(timer);
        t = 0;
        $("#leftMine").html(0);
        var start = confirm("Congratulations! You win! Once more?");
        if (start) {
            event.trigger("INIT");
        } else {
            control.unbind();
        }
    });
    event.listen("FLAG", function(num) {
        $("#leftMine").html(num);
    });
    event.listen("FAILURE", function() {
        clearInterval(timer);
        t = 0;
        var start = confirm("Sorry, you lose. Try again?");
        if (start) {
            event.trigger("INIT");
        } else {
            control.unbind();
        }
    });

    // 重玩
    $("#restart").bind("click", function() {
        event.trigger("INIT");
    });

    // 设置游戏级别
    $("#gameLevel").bind("change", function() {
        event.trigger("INIT", +this.value);
    });


});