requirejs.config({
    baseUrl: 'js/modules'
});

// Start the main app logic.
requirejs(['test'], function (a) {
    console.log(a);
});