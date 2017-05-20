'use strict';

var ReactOnml = require('../lib'),
    jsof = require('jsof'),
    React = require('react');

var $ = React.createElement;

describe('basic', function () {

    it('t1', function (done) {
        var el = $('div', {});
        var res = {};
        ReactOnml.render(el);
        ReactOnml.flush();
        console.log(jsof.stringify(res));
        done();
    });
});
