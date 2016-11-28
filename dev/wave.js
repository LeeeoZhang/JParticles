// wave.js
+function (Particleground) {
    'use strict';

    var util = Particleground.util,
        limitRandom = util.limitRandom,
        randomColor = util.randomColor,
        scaleValue = util.scaleValue,
        random = Math.random,
        sin = Math.sin,
        pi2 = Math.PI * 2,
        UNDEFINED = 'undefined',
        isArray = Array.isArray;

    function Wave(selector, options) {
        util.createCanvas(this, Wave, selector, options);
    }

    Wave.defaultConfig = {
        // 波纹个数
        num: 3,
        // 波纹背景颜色，当fill设置为true时生效
        fillColor: [],
        // 波纹线条(边框)颜色，当stroke设置为true时生效
        lineColor: [],
        // 线条宽度
        lineWidth: [],
        // 线条的横向偏移值，(0, 1)表示容器宽度的倍数，[1, +∞)表示具体数值
        offsetLeft: [],
        // 线条的纵向偏移值，线条中点到元素顶部的距离，(0, 1)表示容器高度的倍数，[1, +∞)表示具体数值
        offsetTop: [],
        // 波峰高度，(0, 1)表示容器高度的倍数，[1, +∞)表示具体数值
        crestHeight: [],
        // 波纹个数，即正弦周期个数
        rippleNum: [],
        // 运动速度
        speed: [],
        // 是否填充背景色，设置为false相关值无效
        fill: false,
        // 是否绘制边框，设置为false相关值无效
        stroke: true
    };


    var fn = Wave.prototype = {
        version: '1.0.0',
        init: function () {
            if (this.set.num > 0) {

                // 线条波长，每个周期(2π)在canvas上的实际长度
                this.rippleLength = [];

                this.attrNormalize();
                this.createDots();
                this.draw();
                this.resize();
            }
        },
        attrNormalize: function () {
            [
                'fillColor', 'lineColor', 'lineWidth',
                'offsetLeft', 'offsetTop', 'crestHeight',
                'rippleNum', 'speed', 'fill', 'stroke'

            ].forEach(function (attr) {

                this.attrProcessor(attr);

            }.bind(this));
        },
        attrProcessor: function (attr) {
            var num = this.set.num;
            var attrVal = this.set[attr];
            var std = attrVal;
            var scale = attr === 'offsetLeft' ? this.cw : this.ch;

            if (!isArray(attrVal)) {
                std = this.set[attr] = [];
            }

            // 将数组、字符串、数字、布尔类型属性标准化，假设num=3，如：
            // crestHeight: []或[2]或[2, 2], 标准化成: [2, 2, 2]
            // crestHeight: 2, 标准化成: [2, 2, 2]
            // 注意：(0, 1)表示容器高度的倍数，[1, +∞)表示具体数值，其他属性同理
            while (num--) {
                var val = isArray(attrVal) ? attrVal[num] : attrVal;

                std[num] = typeof val === UNDEFINED ?
                    this.generateAttrVal(attr) :
                    this.scaleValue(attr, val, scale);

                if (attr === 'rippleNum') {
                    this.rippleLength[num] = this.cw / std[num];
                }
            }
        },
        scaleValue: function (attr, val, scale) {
            if (attr === 'offsetTop' || attr === 'offsetLeft' || attr === 'crestHeight') {
                return scaleValue(val, scale);
            }
            return val;
        },
        generateAttrVal: function (attr) {
            var cw = this.cw;
            var ch = this.ch;

            switch (attr) {
                case 'lineColor':
                case 'fillColor':
                    attr = randomColor();
                    break;
                case 'lineWidth':
                    attr = limitRandom(2, .2);
                    break;
                case 'offsetLeft':
                    attr = random() * cw;
                    break;
                case 'offsetTop':
                case 'crestHeight':
                    attr = random() * ch;
                    break;
                case 'rippleNum':
                    attr = limitRandom(cw / 2, 1);
                    break;
                case 'speed':
                    attr = limitRandom(.4, .1);
                    break;
                case 'fill':
                    attr = false;
                    break;
                case 'stroke':
                    attr = true;
                    break;
            }
            return attr;
        },
        setOffsetTop: function (topVal) {
            if (this.set.num > 0) {

                if (!isArray(topVal) && topVal > 0 && topVal < 1) {
                    topVal *= this.ch;
                }

                this.set.offsetTop.forEach(function (v, i, array) {

                    // topVal[ i ] || v: 当传入的topVal数组少于自身数组的长度，
                    // 超出部分保持它的原有值，以保证不出现undefined
                    array[i] = isArray(topVal) ? ( topVal[i] || v ) : topVal;
                });
            }
        },
        createDots: function () {
            var dots = this.dots = [];
            var rippleLength = this.rippleLength;
            var cw = this.cw;
            var num = this.set.num;

            while (num--) {
                var line = [];

                // 点的y轴步进
                var step = pi2 / rippleLength[num];

                // 创建一条线段所需的点
                for (var j = 0; j < cw; j++) {
                    line.push({
                        x: j,
                        y: j * step
                    });
                }

                dots[num] = line;
            }
        },
        draw: function () {
            var set = this.set;
            if (set.num <= 0) {
                return;
            }

            var cxt = this.cxt,
                cw = this.cw,
                ch = this.ch,
                paused = this.paused;

            cxt.clearRect(0, 0, cw, ch);
            cxt.globalAlpha = set.opacity;

            this.dots.forEach(function (lineDots, i) {
                var crestHeight = set.crestHeight[i];
                var offsetLeft = set.offsetLeft[i];
                var offsetTop = set.offsetTop[i];
                var speed = set.speed[i];

                cxt.save();
                cxt.beginPath();
                lineDots.forEach(function (v, j) {
                    cxt[j ? 'lineTo' : 'moveTo'](
                        v.x,

                        // y = A sin（ ωx + φ ）+ h
                        crestHeight * sin(v.y + offsetLeft) + offsetTop
                    );
                    !paused && ( v.y -= speed );
                });
                if (set.fill[i]) {
                    cxt.lineTo(cw, ch);
                    cxt.lineTo(0, ch);
                    cxt.closePath();
                    cxt.fillStyle = set.fillColor[i];
                    cxt.fill();
                }
                if (set.stroke[i]) {
                    cxt.lineWidth = set.lineWidth[i];
                    cxt.strokeStyle = set.lineColor[i];
                    cxt.stroke();
                }
                cxt.restore();
            });
            this.requestAnimationFrame();
        }
    };

    // 继承公共方法，如pause，open
    Particleground.extend(fn);

    util.modifyPrototype(fn, 'resize', function (scaleX, scaleY) {
        if (this.set.num > 0) {
            this.dots.forEach(function (lineDots) {
                lineDots.forEach(function (v) {
                    v.x *= scaleX;
                    v.y *= scaleY;
                });
            });
        }
    });

    // 添加实例
    Particleground.wave = fn.constructor = Wave;

}(Particleground);