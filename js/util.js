/**
 * A few utility functions.
 */

var PS = PS || {};

(function() {
    var compare = function(a, b) { return a - b; };

    var clamp = function(val, min, max) {
        return Math.max(min, Math.min(max, val));
    };

    var sign = function(v) {
        return v == 0 ? 0 : v / Math.abs(v);
    }

    PS.util = {
        clamp: clamp,
        clamp01: function(val) {
            return clamp(val, 0, 1);
        },
        sortInts: function(ints) {
            ints.sort(compare);
        },

        sign: sign,

        clampSign: function(val, maxMagnitude) {
            if (val < 0)
                return Math.max(val, maxMagnitude);
            return Math.min(val, maxMagnitude);
        }
    };
})();
