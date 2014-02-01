var gui = require('nw.gui');

app = angular.module('app', ['ngRoute', 'ui.codemirror', 'ngAnimate', 'ui.bootstrap']);

$(function(){
    var rx = /INPUT|SPAN|SELECT|TEXTAREA/i;

    $(document).bind("keydown keypress", function(e) {
        if (e.which == 8) {
            if (!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly) {
                e.preventDefault();
            }
        }
    });
});