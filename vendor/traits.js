// Autor: Alfredo Sanzo
// sobre idea de Oscar García : 
// http://www.elclubdelprogramador.com/2013/08/30/javascript-patrones-en-javascript-mixin-pattern/


var Trait = {
	toClass: function( claseDonante, claseReceptora ) {
		Trait.copyFromTo(claseDonante.prototype, claseReceptora.prototype, arguments);
	},

	toObject: function( claseDonante, objetoReceptor ){
		Trait.copyFromTo(claseDonante.prototype, objetoReceptor, arguments);
	},

	copyFromTo: function(orig,dest,args){
		if ( args[2] ) { // solo extendemos los metodos que pasamos por parametros
			for ( var i = 2, len = args.length; i < len; i++ ) {
				dest[args[i]] = orig[args[i]];
			}
		}
		else {	// extendemos todos los metodos
			for ( var nombreMetodo in orig ) {
				if ( !dest[nombreMetodo] ) { // comprobamos que ya no existiese un metodo llamado igual
					dest[nombreMetodo] = orig[nombreMetodo];
				}
			}
		}
	},
};