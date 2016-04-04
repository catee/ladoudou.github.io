requirejs.config({
    baseUrl: 'js/modules'
});

// Start the main app logic.
requirejs(['render/Render', 'data/DyadicArray', 'data/Data', 'controller/Control', 'controller/Event'], function(Render, DyadicArray, Data, Control, Event) {
    console.log(a);
    window.R = new Render({
        canvas: document.querySelector('#canvas')
    });
    // window.D = new DyadicArray([1,0,0,1,1,1,0,0,1,0,0,1], 3, 4);
    window.C = new DyadicArray(new Float32Array([1, 1, 1, 1, 0, 1, 1, 1, 1]), 3, 3);

    var a = new Array();
    for (var i = 0; i < 12000; i++) {
        a.push(Math.random() > 0.5 ? 1 : 0);
    }
    var s = +new Date();
    var a_d = new DyadicArray(a, 120, 100);
    var result = a_d.convolution(C);
    console.log(+new Date() - s);
    console.log(result);

    var s = +new Date();
    window.D = new Data();
    console.log(+new Date() - s);

    // $('#canvas').on('click', function (e) {
    //     R.paintUnit(R.coordinateTransition.c2m(e.offsetX, e.offsetY), 'num0');
    //     console.log(R.coordinateTransition.c2m(e.offsetX, e.offsetY));
    // })

    var control = new Control(window.D, window.R);

    window.Event = new Event();

    $("#restart").bind("click", function() {
        window.Event.trigger("START");
    });

    window.Event.listen("START", function(level) {
        var l = level ? level : 0;
        D.level = l;
        R.level = l;
        $("#leftMine").html(D.countMines);
        control.bind();
    });
    window.Event.listen("SUCCESS", function() {
        var start = confirm("Congratulations! You win! Once more?");
        if (start) {
            window.Event.trigger("START");
        } else {
            control.unbind();
        }
    });
    window.Event.listen("FAILURE", function() {
        var start = confirm("Sorry, you lose. Try again?");
        if (start) {
            window.Event.trigger("START");
        } else {
            control.unbind();
        }
    });
    window.Event.listen("FLAG", function(num) {
        $("#leftMine").html(num);
        console.log("the rest of mines: " + num);
    });

    window.Event.trigger("START", 0);

});