var PS = PS || {};

(function() {
    var SCORE_KEY = "POLYSHOOTER_SCORE";

    // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js
    var hasStorage = (function() {
        var mod = 'modernizr';
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch (exception) {
            return false;
        }
    }());

    var score = null;
    if (hasStorage) {
        // getItem defaults to null if the key isn't present
        score = localStorage.getItem(SCORE_KEY);
    }

    PS.HighScore = {
        hasStorage: hasStorage,

        get: function() {
            return score;
        },

        set: function(newScore) {
            score = newScore;

            if (hasStorage)
                localStorage.setItem(SCORE_KEY, score);
        },
    };
})();