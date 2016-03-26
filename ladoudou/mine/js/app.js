requirejs.config({
    baseUrl: 'js/modules'
});

// Start the main app logic.
requirejs(['test', 'render/render'], function (a, Render) {
    console.log(a);
    window.R = new Render({
        canvas: document.querySelector('#canvas')
    });
});