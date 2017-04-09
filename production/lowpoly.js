+function () { 'use strict';

// lowpoly.js
+function (JParticles) {
    'use strict';

    var utils = JParticles.utils,
        event = JParticles.event,
        random = Math.random,
        abs = Math.abs,
        pi2 = Math.PI * 2;

    function Lowpoly(selector, options) {
        utils.createCanvas(this, Lowpoly, selector, options);
    }

    Lowpoly.defaultConfig = {
        // 粒子个数，默认为容器宽度的0.12倍
        // 传入(0, 1)显示容器宽度相应倍数的个数，传入[1, +∞)显示具体个数
        num: .12,
        // 粒子最大半径(0, +∞)
        maxR: 2.4,
        // 粒子最小半径(0, +∞)
        minR: .6,
        // 粒子最大运动速度(0, +∞)
        maxSpeed: 1,
        // 粒子最小运动速度(0, +∞)
        minSpeed: 0,
        // 线段的宽度
        lineWidth: .2
    };

    var fn = Lowpoly.prototype = {
        version: '1.0.0',
        init: function init() {
            this.dots = [];
            this.createDots();
            this.draw();
            this.resize();
        },
        createDots: function createDots() {
            var cw = this.cw,
                ch = this.ch,
                set = this.set,
                color = this.color,
                limitRandom = utils.limitRandom,
                calcSpeed = utils.calcSpeed,
                maxSpeed = set.maxSpeed,
                minSpeed = set.minSpeed,
                maxR = set.maxR,
                minR = set.minR,
                num = 40 || utils.pInt(utils.scaleValue(set.num, cw)),
                dots = [],
                r;

            while (num--) {
                r = limitRandom(maxR, minR);
                dots.push({
                    x: limitRandom(cw - r, r),
                    y: limitRandom(ch - r, r),
                    r: r,
                    vx: calcSpeed(maxSpeed, minSpeed),
                    vy: calcSpeed(maxSpeed, minSpeed),
                    color: color()
                });
            }

            dots.sort(function (a, b) {
                return a.x - b.x;
            });

            this.dots = dots;
        },
        draw: function draw() {
            var self = this,
                set = self.set,
                cxt = self.cxt,
                cw = self.cw,
                ch = self.ch;

            cxt.clearRect(0, 0, cw, ch);

            // 当canvas宽高改变的时候，全局属性需要重新设置
            cxt.lineWidth = set.lineWidth;
            cxt.globalAlpha = set.opacity;

            self.dots.forEach(function (v) {
                var r = v.r;
                cxt.save();
                cxt.beginPath();
                cxt.arc(v.x, v.y, r, 0, pi2);
                cxt.fillStyle = v.color;
                cxt.fill();
                cxt.restore();
            });

            this.connectDots();
            // self.requestAnimationFrame();
        },
        connectDots: function connectDots() {
            var cxt = this.cxt,
                dots = this.dots;

            cxt.save();
            cxt.beginPath();
            cxt.moveTo(0, 0);

            dots.forEach(function (v) {
                cxt.lineTo(v.x, v.y);
            });

            cxt.strokeStyle = dots[0].color;
            cxt.stroke();
            cxt.restore();
        }
    };

    JParticles.extend(fn);

    JParticles.lowpoly = fn.constructor = Lowpoly;
}(JParticles); }();
//# sourceMappingURL=maps/lowpoly.js.map
