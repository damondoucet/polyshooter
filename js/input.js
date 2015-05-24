var PS = PS || {};

(function() {
    var SINGLE_CLICK = 1;
    var TAB_KEY_CODE = 9;

    var clamp = function(val, min, max) {
        return Math.min(max, Math.min(max, val));
    }

    PS.registerInput = function(canvas, onClick, onKey) {
        $(canvas).mousedown(function(data) {
            // We do this to avoid double click selecting text.
            canvas.focus();
            return false;
        });

        $(canvas).click(function(data) {
            data.preventDefault();
            if (data.which !== SINGLE_CLICK)
                return;

            var dx = data.pageX - canvas.offsetLeft,
                dy = data.pageY - canvas.offsetTop;

            var x = 1.0 * dx / canvas.width,
                y = 1.0 * dy / canvas.height;

            onClick(clamp(x, 0, 1), clamp(y, 0, 1));
        });

        $(canvas).keydown(function(data) {
            var key = data.which || data.keyCode;
            if (key == TAB_KEY_CODE)
                data.preventDefault();

            var str = String.fromCharCode(key);

            if (str !== "")
                onKey(str);
        });
    };
})();
