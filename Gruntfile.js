var shell = require('shelljs');

module.exports = function(grunt) {

  grunt.initConfig({
    qunit: {
      files: ['tests/index.html']
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
            'public/libs/copyright.js',
            'public/libs/PxLoader.js',
            'public/libs/PxLoaderImage.js',
            'public/libs/Box2dWeb-2.1.a.3.js',
            'public/libs/traits.js',
            'public/libs/preloadjs-0.4.1.min.js',
            'public/libs/soundjs-0.5.2.min.js',
            'public/libs/easeljs-0.7.1.min.js',
            'public/libs/tweenjs-0.5.1.min.js',
            'public/libs/uuid.js',
            'public/libs/rsvp-latest.js',
            'public/pilasweb.js',
        ],
        dest: 'dist/pilasweb.js',
      },
    },
    typescript: {
      base: {
        src: ['src/**/*.ts'],
        dest: 'public/pilasweb.js',
        options: {
          module: 'commonjs',
          target: 'es5',
          sourceMap: false,
          fullSourceMapPath: false,
          declaration: true,
          comments: true,
          }
        }
      },
    copy: {
      main: {
        src: 'public/pilasweb.d.ts',
        dest: 'dist/pilasweb.d.ts',
      },
      documentacion_html: {
        src: 'docs/build/html/**',
        dest: 'ide/docs/',
      },
    },
    watch: {
      scripts: {
        files: ['src/**', 'test/**'],
        tasks: ['clear', 'typescript', 'concat', 'copy'],
      }
    },
  });

  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('tags', ['tags']);
  grunt.registerTask('test', ['test']);
  grunt.registerTask('clear', ['clear']);

  grunt.registerTask('clear', "limpia la pantalla", function() {
    shell.exec('clear');
  });

  grunt.registerTask('generar_docs', "create documentation files", function() {
    shell.exec('git submodule update --init');
  });

  grunt.registerTask('make_docs', "create documentation files", function() {
    shell.exec('jsduck public/pilasweb.js --title="pilas-engine web" --images=docs/images/ -o docs/html');
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.registerTask('docs', ['typescript', 'concat', 'make_docs']);
  grunt.registerTask('default', ['typescript', 'concat', 'copy']);
  grunt.registerTask('test', 'qunit');
};
