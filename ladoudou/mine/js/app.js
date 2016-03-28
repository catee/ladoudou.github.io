requirejs.config({
    baseUrl: 'js/modules'
});

// Start the main app logic.
requirejs(['test', 'render/render', 'data/DyadicArray'], function (a, Render, DyadicArray) {
    console.log(a);
    window.R = new Render({
        canvas: document.querySelector('#canvas')
    });
    window.D = new DyadicArray([1,0,0,1,1,1,0,0,1,0,0,1], 3, 4);
    window.C = new DyadicArray(new Float32Array([1, 1, 1, 1, 0, 1, 1, 1, 1]), 3, 3);
});