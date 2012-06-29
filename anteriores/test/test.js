var requirejs = require('requirejs');
var should = require('should');
var util = require('util');

requirejs.config({nodeRequire: require});

function test_suite(mootools, pilas) {

    describe("Pilas", function(){
        it("debe iniciar el modulo", function(){
        })
    })

}

var dependencias = ['../pilas/libs/mootools-core-1.4.5-server.js', '../pilas/main.js']
requirejs(dependencias, test_suite)
