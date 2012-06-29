define(['mootools'], function(mootools){

    var Actor = new mootools.Class({
        saludar: function(){
            console.log("Hola mundo!");
        },
    })


    return {
        Actor: Actor,
    }
})
