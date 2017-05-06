import './helpers/dom';
import test from 'ava';
import pkg from '../package.json';
const JParticles = require('../production/jparticles');
const {utils, Base, version} = JParticles;

test('version', t => {
    if (version === pkg.version) {
        t.pass('版本号测试通过');
    } else {
        t.fail('版本号测试失败');
    }
});