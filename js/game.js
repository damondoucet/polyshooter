var PS = PS || {};

$(function() {
    PS.gameOver = false;
    PS.kill = function() { PS.gameOver = true; };

    var canvas = document.getElementById('game');
    if (!canvas.getContext) {
        console.log("Unsupported browser!");
        return;
    }

    var renderer = PS.createRenderer(canvas);
    var draw = function() {
        renderer.reset();
        renderer.fillCircle(0.4, 0.3, 0.05);
        renderer.fillPolygon(0.25, 0.5, Math.PI, 0.1, 5);
        renderer.fillPolygon(0.5, 0.5, Math.PI, 0.1, 3);
        renderer.fillPolygon(0.25, 0.75, Math.PI / 2, 0.2, 4);

        if (!PS.gameOver)
            setTimeout(draw, 1000);
    };

    // TODO(ddoucet): game manager should expose these
    var onClick = function(x, y) {
        console.log("Click: " + x + "," + y);
    };
    var onKey = function(key) {
        console.log("Key: " + key);
    };
    PS.registerInput(canvas, onClick, onKey);

    draw();
});
