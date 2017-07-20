import './helpers/dom';
import '../../production/particle';
import test from 'ava';
const {particle} = JParticles;

test('defaultConfig', t => {
    t.deepEqual(particle.defaultConfig, {
        num: .12,
        maxR: 2.4,
        minR: .6,
        maxSpeed: 1,
        minSpeed: .1,
        proximity: .2,
        range: .2,
        lineWidth: .2,
        lineShape: 'spider',
        eventElem: null,
        parallax: false,
        parallaxLayer: [1, 2, 3],
        parallaxStrength: 3
    });
});

test('change defaultConfig', t => {
    const newConfig = {
        num: 2,
        maxR: 2,
        minR: 1
    };
    particle.defaultConfig = newConfig;
    t.deepEqual(particle.defaultConfig, newConfig);
});