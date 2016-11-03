// particle.js
+function (Particleground) {
    'use strict';

    var util = Particleground.util,
        event = Particleground.event,
        random = Math.random,
        abs = Math.abs,
        pi2 = Math.PI * 2;

    /**
     * 检查元素或其祖先节点的属性是否等于预给值
     * @param elem {element} 起始元素
     * @param property {string} css属性
     * @param value {string} css属性值
     * @returns {boolean}
     */
    function checkParentsProperty(elem, property, value) {
        var getCss = util.getCss;
        while (elem = elem.offsetParent) {
            if (getCss(elem, property) === value) {
                return true;
            }
        }
        return false;
    }

    function Particle(selector, options) {
        util.createCanvas(this, Particle, selector, options);
    }

    Particle.defaultConfig = {
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
        // 两点连线的最大值
        // 在range范围内的两点距离小于distance，则两点之间连线
        distance: 130,
        // 线段的宽度
        lineWidth: .2,
        // 定位点的范围，范围越大连线越多，当range等于0时，不连线，相关值无效
        range: 160,
        // 改变定位点坐标的事件元素，null表示canvas画布，或传入原生元素对象，如document等
        eventElem: null
    };

    var fn = Particle.prototype = {
        version: '1.1.0',
        init: function () {
            if (this.set.num > 0) {
                if (this.set.range > 0) {

                    // 设置移动事件元素
                    if (!util.isElem(this.set.eventElem) && this.set.eventElem !== document) {
                        this.set.eventElem = this.c;
                    }

                    // 定位点坐标
                    this.posX = random() * this.cw;
                    this.posY = random() * this.ch;
                    this.event();
                }
                this.createDots();
                this.draw();
                this.resize();
            }
        },
        createDots: function () {
            var cw = this.cw,
                ch = this.ch,
                set = this.set,
                color = this.color,
                limitRandom = util.limitRandom,
                calcSpeed = util.calcSpeed,
                maxSpeed = set.maxSpeed,
                minSpeed = set.minSpeed,
                maxR = set.maxR,
                minR = set.minR,
                num = util.pInt(util.scaleValue(set.num, cw)),
                dots = [], r;

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

            this.dots = dots;
        },
        draw: function () {
            var set = this.set;
            if (set.num <= 0) {
                return;
            }

            var cw = this.cw;
            var ch = this.ch;
            var cxt = this.cxt;
            var paused = this.paused;

            cxt.clearRect(0, 0, cw, ch);

            // 当canvas宽高改变的时候，全局属性需要重新设置
            cxt.lineWidth = set.lineWidth;
            cxt.globalAlpha = set.opacity;

            this.dots.forEach(function (v) {
                var r = v.r;
                cxt.save();
                cxt.beginPath();
                cxt.arc(v.x, v.y, r, 0, pi2);
                cxt.fillStyle = v.color;
                cxt.fill();
                cxt.restore();

                // 暂停的时候，vx和vy保持不变，这样自适应窗口变化的时候不会出现粒子移动的状态
                if (!paused) {
                    v.x += v.vx;
                    v.y += v.vy;

                    var x = v.x;
                    var y = v.y;

                    if (x + r >= cw || x - r <= 0) {
                        v.vx *= -1;
                    }
                    if (y + r >= ch || y - r <= 0) {
                        v.vy *= -1;
                    }
                }
            });

            // 当连接范围小于0时，不连接线，可以做出球或气泡运动效果
            if (set.range > 0) {
                this.connectDots();
            }

            this.requestAnimationFrame();
        },
        connectDots: function () {
            var cxt = this.cxt,
                set = this.set,
                dis = set.distance,
                posX = this.posX,
                posY = this.posY,
                posR = set.range,
                dots = this.dots,
                length = dots.length;

            dots.forEach(function (v, i) {
                var vx = v.x;
                var vy = v.y;
                var color = v.color;

                while (++i < length) {
                    var sibDot = dots[i];
                    var sx = sibDot.x;
                    var sy = sibDot.y;

                    if (abs(vx - sx) <= dis &&
                        abs(vy - sy) <= dis && (
                        abs(vx - posX) <= posR &&
                        abs(vy - posY) <= posR ||
                        abs(sx - posX) <= posR &&
                        abs(sy - posY) <= posR )) {
                        cxt.save();
                        cxt.beginPath();
                        cxt.moveTo(vx, vy);
                        cxt.lineTo(sx, sy);
                        cxt.strokeStyle = color;
                        cxt.stroke();
                        cxt.restore();
                    }
                }
            });
        },
        getElemOffset: function () {
            return (this.elemOffset = this.elemOffset ? util.offset(this.set.eventElem) : null);
        },
        event: function () {
            if (this.set.eventElem !== document) {
                this.elemOffset = true;
            }

            // move事件处理函数
            this.moveHandler = function (e) {
                this.posX = e.pageX;
                this.posY = e.pageY;

                // 动态计算 elemOffset 值
                if (this.getElemOffset()) {

                    // 动态判断祖先节点是否具有固定定位，有则使用client计算
                    if (checkParentsProperty(this.set.eventElem, 'position', 'fixed')) {
                        this.posX = e.clientX;
                        this.posY = e.clientY;
                    }
                    this.posX -= this.elemOffset.left;
                    this.posY -= this.elemOffset.top;
                }
            }.bind(this);

            // 添加move事件
            eventHandler.call(this);
        }
    };

    // 继承公共方法，如pause，open
    Particleground.extend(fn);

    function eventHandler(eventType) {
        var context = this;
        var set = context.set;
        if (set.num > 0 && set.range > 0) {

            // 使用传递过来的关键字判断绑定事件还是移除事件
            eventType = eventType === 'pause' ? 'off' : 'on';
            event[eventType](set.eventElem, 'mousemove', context.moveHandler);
            event[eventType](set.eventElem, 'touchmove', context.moveHandler);
        }
    }

    // 修改原型pause，open方法
    util.modifyPrototype(fn, 'pause, open', eventHandler);

    // 修改原型resize方法
    util.modifyPrototype(fn, 'resize', function (scaleX, scaleY) {
        if (this.set.num > 0 && this.set.range > 0) {
            this.posX *= scaleX;
            this.posY *= scaleY;
            this.getElemOffset();
        }
    });

    // 添加实例
    Particleground.particle = fn.constructor = Particle;

}(Particleground);

