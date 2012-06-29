define(['actores', 'mootools', 'utils'], function(actores, mootools, utils){

    var Pilas = new mootools.Class({
        utils: utils,
        actores: actores,
    });

    return {
        Pilas:Pilas,
    }
})
