/**
 * Registers input handlers to the canvas (including removing the double-click
 * to select text).
 *
 * Exports two methods:
 *   - getKeysDown()
 *      returns a dictionary of string to boolean
 *          the string is an uppercase character
 *          boolean is whether that key is currently being held
 *          any key not in the dictinoary is not being held
 *   - setClickHandler(handler)
 *      sets the handler to be called when the mouse is clicked
 *          handler is a function(x, y), where x and y are based on percentages
 *          of the canvas (e.g., 0.5, 0.5 is a click to the middle of the
 *          canvas).
 */

// TODO(ddoucet): handle holding mouse button

var PS = PS || {};

(function() {
    var SINGLE_CLICK = 1;
    var TAB_KEY_CODE = 9;

    PS.registerInput = function(canvas) {
        var onClick = null;
        var keysDown = {};

        $(canvas).mousedown(function(data) {
            // We do this to avoid double click selecting text.
            canvas.focus();
            return false;
        });

        $(canvas).click(function(data) {
            if (!onClick)
                return;

            data.preventDefault();
            if (data.which !== SINGLE_CLICK)
                return;

            var dx = data.pageX - canvas.offsetLeft,
                dy = data.pageY - canvas.offsetTop;

            var x = 1.0 * dx / canvas.width,
                y = 1.0 * dy / canvas.height;

            onClick(PS.util.clamp01(x), PS.util.clamp01(y));
        });

        var keyDown = function(data) {
            var key = data.which || data.keyCode;
            if (key == TAB_KEY_CODE)
                data.preventDefault();

            var str = String.fromCharCode(key).trim();

            if (str !== "")
                keysDown[str] = true;
        }

        var keyUp = function(data) {
            var key = data.which || data.keyCode;
            var str = String.fromCharCode(key).trim();

            if (str !== "")
                keysDown[str] = false;
        };

        $(canvas).keydown(keyDown);
        $(document).keydown(keyDown);

        $(canvas).keyup(keyUp);
        $(document).keyup(keyUp);

        return {
            getKeysDown: function() {
                return keysDown;
            },

            setClickHandler: function(handler) {
                onClick = handler;
            }
        };
    };
})();
