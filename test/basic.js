'use strict';

var ReactOnml = require('../lib'),
    jsof = require('jsof'),
    React = require('react');

var $ = React.createElement;

var T1 = function (props) {
    return $('span', props,
        $('div', {},
            $('title', {}, props.foo),
            'text2'
        ),
        'text1'
    );
};

describe('basic', function () {

    it('t1', function (done) {
        var res = [];
        ReactOnml.render(
            $(T1, { foo: 'bar' }),
            function (root) {
                console.log(jsof.stringify(root));
                done();
            },
            res
        );
        ReactOnml.flush();
    });
});

/* eslint-env mocha */
/* eslint no-console: 1 */
