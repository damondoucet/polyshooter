/**
 * A few utility functions.
 */

var PS = PS || {};

(function() {
    var compare = function(a, b) { return a - b; };

    var clamp = function(val, min, max) {
        return Math.max(min, Math.min(max, val));
    };

    PS.util = {
        clamp: clamp,
        clamp01: function(val) {
            return clamp(val, 0, 1);
        },
        sortInts: function(ints) {
            ints.sort(compare);
        }
    };
})();
