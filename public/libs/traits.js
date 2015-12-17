// Autor: Alfredo Sanzo
// sobre idea de Oscar García : 
// http://www.elclubdelprogramador.com/2013/08/30/javascript-patrones-en-javascript-mixin-pattern/


var Trait = new {
	toClass: function( claseDonante, claseReceptora ) {
		this.copyFromTo(claseDonante.prototype, claseReceptora.prototype);
	},

	toObject: function( claseDonante, objetoReceptor ){
		this.copyFromTo(claseDonante.prototype, objetoReceptor);
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
}();