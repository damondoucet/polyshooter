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
        var clickHandlers = {};
        var keysDown = {};
        var div = $(canvas).parent();

        $(div).mousedown(function(data) {
            // We do this to avoid double click selecting text.
            canvas.focus();
            return false;
        });

        $(div).click(function(data) {
            data.preventDefault();

            $.each(clickHandlers, function(_, onClick) {
                if (data.which !== SINGLE_CLICK)
                    return;

                var dx = data.pageX - canvas.offsetLeft,
                    dy = data.pageY - canvas.offsetTop;

                var x = 1.0 * dx / canvas.width,
                    y = 1.0 * dy / canvas.height;

                onClick(PS.util.clamp01(x), PS.util.clamp01(y));
            });

            return true;
        });

        $("a").click(function() {
            return true;
        });

        $(document).keydown(function(data) {
            var key = data.which || data.keyCode;
            if (key == TAB_KEY_CODE)
                data.preventDefault();

            var str = String.fromCharCode(key).trim();

            if (str !== "")
                keysDown[str] = true;

            return true;
        });

        $(document).keyup(function(data) {
            var key = data.which || data.keyCode;
            var str = String.fromCharCode(key).trim();

            if (str !== "")
                keysDown[str] = false;

            return true;
        });

        var id = 0;
        return {
            getKeysDown: function() {
                return keysDown;
            },

            // Returns the id of the click handler, which can be used to remove
            // it later.
            addClickHandler: function(handler) {
                clickHandlers[id] = handler;
                return id++;
            },

            removeClickHandler: function(id) {
                delete clickHandlers[id];
            }
        };
    };
})();
