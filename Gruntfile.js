var shell = require('shelljs');

module.exports = function(grunt) {

  grunt.initConfig({
    notify_hooks: {
                    options: {
                               enabled: true,
                               max_jshint_notifications: 5,
                               success: false,
                               duration: 3
                             }
    },
    nodewebkit: {
                  options: {
                            //version: '0.8.3',
                            version: '0.7.5',
                            build_dir: './webkitbuilds',
                            mac: true,
                            win: true,
                            linux32: true,
                            linux64: true
                },
                src: [
                  './ide/**/*',
                  './src/**/*',
                  './node_modules/**/*',
                ]
            },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
            'public/libs/PxLoader.js',
            'public/libs/PxLoaderImage.js',
            'public/libs/Box2dWeb-2.1.a.3.js',
            'public/libs/preloadjs-0.4.1.min.js',
            'public/libs/soundjs-0.5.2.min.js',
            'public/libs/easeljs-0.7.1.min.js',
            'public/libs/tweenjs-0.5.1.min.js',
            'public/libs/uuid.js',
            'public/libs/rsvp-latest.js',
            'public/pilasweb.js',
        ],
        dest: 'public/pilasweb.js',
      },
    },
    typescript: {
      base: {
        src: ['src/**/*.ts'],
        dest: 'public/pilasweb.js',
        options: {
          module: 'commonjs',
          target: 'es5',
          basePath: 'src',
          sourceMap: false,
          fullSourceMapPath: false,
          declaration: false,
          comments: true,
          }
        }
      },
    copy: {
      main: {
        src: 'public/**',
        dest: 'ide/',
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

  grunt.registerTask('generar_docs', "create documentation files", function() {
    shell.exec('git submodule update --init');
    shell.exec('cd docs; make actualizar_docs_pilasweb');
  });

  grunt.registerTask('make_docs', "create documentation files", function() {
    shell.exec('jsduck public/pilasweb.js --title="pilas-engine web" --images=docs/images/ -o docs/html');
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.registerTask('docs', ['typescript', 'concat', 'make_docs']);
  grunt.registerTask('default', ['typescript', 'concat', 'copy']);

  // Load the task
  grunt.loadNpmTasks('grunt-notify');
  // This is required if you use any options.
  grunt.task.run('notify_hooks');
};
