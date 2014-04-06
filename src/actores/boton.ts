class Boton extends Actor {
  ruta_normal;
  ruta_press;
  ruta_over;
  funciones_normal;
  funciones_press;
  funciones_over;
  estado;

  constructor(x, y,
        ruta_normal='boton/boton_normal.png',
        ruta_press='boton/boton_press.png',
        ruta_over='boton/boton_over.png')  {



    this.ruta_normal = ruta_normal;
    this.ruta_press = ruta_press;
    this.ruta_over = ruta_over;

    this.funciones_normal = [];
    this.funciones_press = [];
    this.funciones_over = [];

    this.estado = true;

    super(ruta_normal, x, y);

    pilas.escena_actual().click_de_mouse.conectar(this);
    pilas.escena_actual().mueve_mouse.conectar(this);
  }

  recibir(evento, tipo) {
    if (tipo == pilas.escena_actual().click_de_mouse) {
      this.detectar_clic(evento);
    }
    if (tipo == pilas.escena_actual().mueve_mouse) {
      this.detectar_movimiento(evento);
    }
   }

   conectar_normal(funcion, args=undefined) {
     var temp = [funcion,args]
     this.funciones_normal.push(temp);
   }

   conectar_presionado(funcion, args=undefined) {
     var temp = [funcion,args]
     this.funciones_press.push(temp);
   }

   conectar_sobre(funcion, args=undefined) {
     var temp = [funcion,args]
     this.funciones_over.push(temp);
   }

   desconectar_normal_todo() {
     this.funciones_normal = [];
   }

   desconectar_presionado_todo() {
     this.funciones_press = [];
   }

   desconectar_sobre_todo() {
     this.funciones_over = [];
   }

   desconectar_normal(funcion, args) {
        for (var i=0;i<this.funciones_normal.length;i++) {
          if(this.funciones_normal[i][0] == funcion) {
              if(this.funciones_normal[i][1] == args) {
                  this.funciones_normal.splice(i,1);
              }
            }
      }
   }

   desconectar_presionado(funcion, args) {
        for (var i=0;i<this.funciones_press.length;i++) {
            if(this.funciones_press[i][0] == funcion) {
              if(this.funciones_press[i][1] == args) {
                  this.funciones_press.splice(i,1);
              }
            }
      }
   }

   desconectar_sobre(funcion, args) {
        for (var i=0;i<this.funciones_over.length;i++) {
            if(this.funciones_over[i][0] == funcion) {
              if(this.funciones_over[i][1] == args) {
                  this.funciones_over.splice(i,1);
              }
            }
      }
   }

   ejecutar_funciones_normal() {
     if (this.estado) {
       for(var i=0;i<this.funciones_normal.length;i++) {
         if (this.funciones_normal[i][1] == undefined) {
           this.funciones_normal[i][0]();
         }
         else {
           this.funciones_press[i][0](this.funciones_normal[i][1]);
         }
       }
     }
   }

   ejecutar_funciones_press() {
     if (this.estado) {
      for(var i=0;i<this.funciones_press.length;i++) {
        if (this.funciones_press[i][1] == undefined) {
          this.funciones_press[i][0]();
        }
        else {
          this.funciones_press[i][0](this.funciones_press[i][1]);
        }
      }
     }
   }

   ejecutar_funciones_over() {
     if (this.estado) {
       for(var i=0;i<this.funciones_over.length;i++) {
         if(this.funciones_over[i][1] == undefined) {
           this.funciones_over[i][0]();
         }
         else {
           this.funciones_over[i][0](this.funciones_over[i][1]);
         }
        }
      }
   }

   activar() {
     this.estado = true;
   }

   desactivar() {
     this.estado = false;
   }

   pintar_normal() {
     this.imagen = this.ruta_normal;
   }

   pintar_presionado() {
     this.imagen = this.ruta_press;
   }

   pintar_sobre() {
     this.imagen = this.ruta_over;
   }

  detectar_clic(click) {
    if(this.colisiona_con_un_punto(click.x, click.y)) {
      this.ejecutar_funciones_press();
    }
  }

  detectar_movimiento(evento) {
    if(this.colisiona_con_un_punto(evento.x, evento.y)) {
      this.ejecutar_funciones_over();
    }
    else {
      this.ejecutar_funciones_normal();
    }
  }
}
