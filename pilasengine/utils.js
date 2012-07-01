define(['require', 'mootools'], function(require, mootools){
        var Utils = new Class({

            convertir_a_radianes: function (grados) {
                return grados * (Math.PI / 180);
            },

            convertir_a_grados: function (radianes) {
                return radianes * (180 / Math.PI);
            },

        });

    function sumar(a, b) {
        return a + b
    }

    return {
        sumar: sumar,
        Utils: Utils
    }
})
