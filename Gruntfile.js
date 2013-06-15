var shell = require('shelljs');

module.exports = function(grunt) {

	grunt.initConfig({
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
          }
        }
      },
		watch: {
			scripts: {
				files: ['src/**/*.ts'],
				tasks: ['typescript'],
      }
    }
  });

  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('tags', ['tags']);

  grunt.registerTask('tags', "create ctags files", function() {
    shell.exec('ctags src/*');
  });

  grunt.registerTask('default', ['typescript']);
};

