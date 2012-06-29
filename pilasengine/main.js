define(['actores', 'mootools', 'utils', 'libs/easeljs-0.4.2.min', 'libs/Box2dWeb-2.1.a.3.min'], function(actores, mootools, utils, easel, box2d){

    var Pilas = new mootools.Class({

        initialize: function(id_canvas){
            this.canvas = document.id(canvas) 
            this.stage = new Stage(this.canvas)
        },

        utils: utils,
        actores: actores,
    });

    return {
        Pilas:Pilas,
    }
})
