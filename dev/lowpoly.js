// lowpoly.js
+function (Particleground) {
    'use strict';

    var util = Particleground.util,
        random = Math.random,
        abs = Math.abs,
        pi2 = Math.PI * 2;

    function Lowpoly(selector, options) {
        util.createCanvas(this, Lowpoly, selector, options);
    }

    Lowpoly.defaultConfig = {
        color: '#fff',
        maxSpeed: .6,
        minSpeed: 0
    };

    var fn = Lowpoly.prototype = {
        version: '1.0.0',
        init: function () {
            this.dots = [];
            this.createDots();
            this.draw();
            this.resize();
        },
        snowShape: function () {
            var set = this.set,
                calcSpeed = util.calcSpeed,
                maxSpeed = set.maxSpeed,
                minSpeed = set.minSpeed,
                r = util.limitRandom(set.maxR, set.minR);
            return {
                x: random() * this.cw,
                y: -r,
                r: r,
                vx: calcSpeed(maxSpeed, minSpeed),

                // r 越大，设置垂直速度越快，这样比较有近快远慢的层次效果
                vy: abs(r * calcSpeed(maxSpeed, minSpeed)),
                color: this.color()
            };
        },
        createDots: function () {
            // 随机创建0-6个雪花
            var count = util.pInt(random() * 6);
            var dots = this.dots;
            while (count--) {
                dots.push(this.snowShape());
            }
        },
        draw: function () {
            var self = this,
                set = self.set,
                cxt = self.cxt,
                cw = self.cw,
                ch = self.ch,
                paused = self.paused;

            cxt.clearRect(0, 0, cw, ch);
            cxt.globalAlpha = set.opacity;

            self.dots.forEach(function (v, i, array) {
                var x = v.x;
                var y = v.y;
                var r = v.r;

                cxt.save();
                cxt.beginPath();
                cxt.arc(x, y, r, 0, pi2);
                cxt.fillStyle = v.color;
                cxt.fill();
                cxt.restore();

                if (!paused) {
                    v.x += v.vx;
                    v.y += v.vy;

                    // 雪花反方向飘落
                    if (random() > .99 && random() > .5) {
                        v.vx *= -1;
                    }

                    // 雪花从侧边出去，删除
                    if (x < 0 || x - r > cw) {
                        array.splice(i, 1, self.snowShape());

                        // 雪花从底部出去，删除
                    } else if (y - r >= ch) {
                        array.splice(i, 1);
                    }
                }
            });

            // 添加雪花
            if (!paused && random() > .9) {
                self.createDots();
            }

            self.requestAnimationFrame();
        }
    };

    // 继承公共方法，如pause，open
    Particleground.extend(fn);

    // 添加实例
    Particleground.lowpoly = fn.constructor = Lowpoly;

}(Particleground);