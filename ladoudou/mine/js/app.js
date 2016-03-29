requirejs.config({
    baseUrl: 'js/modules'
});

// Start the main app logic.
requirejs(['test', 'render/render', 'data/DyadicArray', 'data/Data'], function (a, Render, DyadicArray, Data) {
    console.log(a);
    window.R = new Render({
        canvas: document.querySelector('#canvas')
    });
    // window.D = new DyadicArray([1,0,0,1,1,1,0,0,1,0,0,1], 3, 4);
    window.C = new DyadicArray(new Float32Array([1, 1, 1, 1, 0, 1, 1, 1, 1]), 3, 3);

    var a = new Array();
    for (var i = 0; i < 12000; i++){
        a.push(Math.random() > 0.5 ? 1 : 0);
    }
    var s = + new Date();
    var a_d = new DyadicArray(a, 120, 100);
    var result = a_d.convolution(C);
    console.log(+ new Date() - s);
    console.log(result);

    var s = + new Date();
    window.D = new Data();
    console.log(+ new Date() - s);

});
