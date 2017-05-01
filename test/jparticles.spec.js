import test from 'ava';
import jsdom, {JSDOM} from 'jsdom';
import jps from '../production/jparticles';
import pkg from '../package.json';

test.before('add dom', async t => {
    await new JSDOM();
});

test('version', t => {
    if (jps.version === pkg.version) {
        t.pass('版本号测试通过');
    } else {
        t.fail('版本号测试失败');
    }
});