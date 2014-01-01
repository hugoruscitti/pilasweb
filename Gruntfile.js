var shell = require('shelljs');

module.exports = function(grunt) {

	grunt.initConfig({	
    nodewebkit: {
                  options: {
                            version: '0.8.3',
                            build_dir: './webkitbuilds',
                            mac: true, // We want to build it for mac
                            win: true, // We want to build it for win
                            linux32: true, // We don't need linux32
                            linux64: true // We don't need linux64
                },
                src: [
                  './ide/**/*',
                  './node_modules/**/*',
                ]
            },
		
		
		
		
		
		
		
		
		
		
		typescript: {
			base: {
				src: ['src/**/*.ts'],
				dest: 'public/pilasweb.js',
				options: {
					module: 'commonjs',
					target: 'es5',
					base_path: 'src',
					sourcemap: false,
					fullSourceMapPath: false,
					declaration: false,
          comments: true,
          }
        }
      },
		watch: {
			scripts: {
				files: ['src/**', 'test/**'],
				tasks: ['clear', 'typescript'],
      }
    },
    mocha_phantomjs: {
      all: ['test/*.html']
    }
  });

  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');

  grunt.registerTask('tags', ['tags']);
  grunt.registerTask('test', ['test']);
  grunt.registerTask('clear', ['clear']);

  grunt.registerTask('tags', "create ctags files", function() {
    shell.exec('ctags src/*');
  });

  grunt.registerTask('test', "ejecuta las pruebas", function() {
    shell.exec('./node_modules/.bin/mocha-phantomjs test/init.html');
  });

  grunt.registerTask('clear', "limpia la pantalla", function() {
    shell.exec('clear');
  });

  grunt.registerTask('make_docs', "create documentation files", function() {
    shell.exec('jsduck public/pilasweb.js --title="pilas-engine web" --images=docs/images/ -o docs/html');
  });

  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.registerTask('docs', ['typescript', 'make_docs']);
  grunt.registerTask('default', ['typescript']);
};

