define([], function(){
    var _pilas = "GOLA";

    function set(n) {
        _pilas = n;
    }

    function get() {
        return _pilas;
    }

    return {
        set: set,
        get: get
    };
});
