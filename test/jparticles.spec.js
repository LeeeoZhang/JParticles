import './helpers/dom';
import test from 'ava';
import pkg from '../package.json';
const JParticles = require('../production/jparticles');
const {utils, Base, version} = JParticles;

test('version', t => {
    t.true(version === pkg.version);
});

test('utils.orientationSupport', t => {
    t.false(utils.orientationSupport);
});

test('utils.pInt', t => {
    t.true(utils.pInt('200px') === 200);
    t.true(utils.pInt('0x200') === 0);
});

test('utils.trimAll', t => {
    t.true(utils.trimAll(' so me st ring ') === 'somestring');
});

test('utils.randomColor', t => {
    const colorRule = /^#[0123456789ABCDEF]{6}$/i;
    for (let i = 0 ; i < 3; i++) {
        t.true(colorRule.test(utils.randomColor()));
    }
});

test('utils.limitRandom', t => {
    [[1, 10], [-6, 7]].forEach(item => {
        for (let i = 0; i < 3; i++) {
            const value = utils.limitRandom(item[0], item[1]);
            value >= item[0] && value < item[1] ? t.pass() : t.fail();
        }
    });

    [[8, 3], [10, -2]].forEach(item => {
        for (let i = 0; i < 3; i++) {
            const value = utils.limitRandom(item[0], item[1]);
            value >= item[1] && value < item[0] ? t.pass() : t.fail();
        }
    });

    t.true(utils.limitRandom(10, 10) === 10);
});

test('utils.extend', t => {
    const obj1 = utils.extend({
        a: 0,
        b: {
            c: 1,
            d: 2
        },
        e: [1, 2, 3]
    }, {
        a: 3,
        b: {
            c: 4
        }
    });
    t.true(JSON.stringify(obj1) === JSON.stringify({
        a: 3,
        b: {
            c: 4
        },
        e: [1, 2, 3]
    }));

    // deep copy
    const obj2 = extend(true, {}, {
        a: 0,
        b: {
            c: 1,
            d: 2
        },
        e: [1, 2, 3]
    }, {
        a: 3,
        b: {
            c: 4
        },
        e: [4, 5]
    });

    console.log(obj2)
    t.true(JSON.stringify(obj2) === JSON.stringify({
        a: 3,
        b: {
            c: 4,
            d: 2
        },
        e: [4, 5]
    }));
    t.true(JSON.stringify(obj2) !== JSON.stringify({
        a: 3,
        b: {
            c: 4,
            d: 2
        },
        e: [1, 2, 3, 4, 5]
    }));
});