/**
 * A few utility functions.
 */

var PS = PS || {};

(function() {
    var clamp = function(val, min, max) {
        return Math.max(min, Math.min(max, val));
    };

    PS.util = {
        clamp: clamp,
        clamp01: function(val) {
            return clamp(val, 0, 1);
        }
    };
})();
