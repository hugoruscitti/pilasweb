class colores {
	//Colores principales.
	negro;
	blanco;
	rojo;
	verde;
	azul;
	gris;

	//Colores secundarios
	amarillo;
	magenta;
	cyan;
	grisclaro;
	grisoscuro;
	verdeoscuro;
	azuloscuro;
	naranja;
	rosa;
	violeta;
	marron;

	//Colores transparentes
	negro_transparente;
	blanco_transparente;
	rojo_transparente;
	verde_transparente;
	azul_transparente;
	gris_transparente;

	constructor() {
		//Colores principales.
		this.negro = createjs.Graphics.getRGB(0, 0, 0)
		this.blanco = createjs.Graphics.getRGB(255, 255, 255)
		this.rojo = createjs.Graphics.getRGB(255, 0, 0)
		this.verde = createjs.Graphics.getRGB(0, 255, 0)
		this.azul = createjs.Graphics.getRGB(0, 0, 255)
		this.gris = createjs.Graphics.getRGB(128, 128, 128)

		//Colores secundarios
		this.amarillo = createjs.Graphics.getRGB(255, 255, 0)
		this.magenta = createjs.Graphics.getRGB(255, 0, 255)
		this.cyan = createjs.Graphics.getRGB(0, 255, 255)
		this.grisclaro = createjs.Graphics.getRGB(192, 192, 192)
		this.grisoscuro = createjs.Graphics.getRGB(100, 100, 100)
		this.verdeoscuro = createjs.Graphics.getRGB(0, 128, 0)
		this.azuloscuro = createjs.Graphics.getRGB(0, 0, 128)
		this.naranja = createjs.Graphics.getRGB(255, 200, 0)
		this.rosa = createjs.Graphics.getRGB(255, 175, 175)
		this.violeta = createjs.Graphics.getRGB(128, 0, 255)
		this.marron = createjs.Graphics.getRGB(153, 102, 0)

		//Colores transparentes
		this.negro_transparente = createjs.Graphics.getRGB(0, 0, 0, 0.5)
		this.blanco_transparente = createjs.Graphics.getRGB(255, 255, 255, 0.5)
		this.rojo_transparente = createjs.Graphics.getRGB(255, 0, 0, 0.5)
		this.verde_transparente = createjs.Graphics.getRGB(0, 255, 0, 0.5)
		this.azul_transparente = createjs.Graphics.getRGB(0, 0, 255, 0.5)
		this.gris_transparente = createjs.Graphics.getRGB(128, 128, 128, 0.5)
	}

}
