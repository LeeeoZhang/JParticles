import {Selector} from 'testcafe';

fixture `particle`
    .page `../../samples/particle.html`;

test(`Canvas width and height should equal to the container`, async t => {
    const demo = Selector('#instance1 .demo');
    const canvas = Selector('#instance1 .demo canvas');

    function testWH() {
        return new Promise(async resolve => {
            const dw = await demo.getStyleProperty('width').then(value => value);
            const dh = await demo.getStyleProperty('height').then(value => value);
            const cw = await canvas.getStyleProperty('width').then(value => value);
            const ch = await canvas.getStyleProperty('height').then(value => value);

            await t.expect(parseInt(cw)).eql(parseInt(dw));
            await t.expect(parseInt(ch)).eql(parseInt(dh));

            resolve();
        });
    }

    await testWH();
    await t.resizeWindow(1000, 400);
    await testWH();
});