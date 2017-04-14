const {utils, Base} = JParticles;
const {pInt, limitRandom, calcSpeed, isArray} = utils;
const {random, abs, PI, sin} = Math;
const twicePI = PI * 2;
const UNDEFINED = 'undefined';

JParticles.wave = class Wave extends Base {

    static defaultConfig = {

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

        // 线条的纵向偏移值，线条中点到元素顶部的距离
        // (0, 1)表示容器高度的倍数，[1, +∞)表示具体数值
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

    get version() {
        return '2.0.0';
    }

    constructor(selector, options) {
        super(Wave, selector, options);
    }

    init() {
        if (this.set.num > 0) {

            // 线条波长，每个周期(2π)在canvas上的实际长度
            this.rippleLength = [];

            this.attrNormalize();
            this.createDots();
            this.draw();
        }
    }

    attrNormalize() {
        [
            'fillColor', 'lineColor', 'lineWidth',
            'offsetLeft', 'offsetTop', 'crestHeight',
            'rippleNum', 'speed', 'fill', 'stroke'

        ].forEach(attr => this.attrProcessor(attr));
    }

    attrProcessor(attr) {
        let num = this.set.num;
        let attrVal = this.set[attr];
        let std = attrVal;
        let scale = attr === 'offsetLeft' ? this.cw : this.ch;

        if (!isArray(attrVal)) {
            std = this.set[attr] = [];
        }

        // 将数组、字符串、数字、布尔类型属性标准化，例如 num = 3：
        // crestHeight: []或[2]或[2, 2], 标准化成: [2, 2, 2]
        // crestHeight: 2, 标准化成: [2, 2, 2]
        // 注意：(0, 1)表示容器高度的倍数，[1, +∞)表示具体数值，其他属性同理
        // scaleValue 用于处理属性值为 (0, 1) 或 [1, +∞) 这样的情况，返回计算好的数值。
        while (num--) {
            const val = isArray(attrVal) ? attrVal[num] : attrVal;

            std[num] = typeof val === UNDEFINED
                ? this.generateAttrVal(attr)
                : this.scaleValue(attr, val, scale);

            if (attr === 'rippleNum') {
                this.rippleLength[num] = this.cw / std[num];
            }
        }
    }

    scaleValue(attr, val, scale) {
        if (attr === 'offsetTop' || attr === 'offsetLeft' || attr === 'crestHeight') {
            return scaleValue(val, scale);
        }
        return val;
    }

    // 以下为缺省情况，属性对应的默认值
    generateAttrVal(attr) {
        const {cw, ch} = this;

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
    }

    setOffsetTop(topVal) {
        const {num, offsetTop} = this.set;

        if (num > 0) {
            if (!isArray(topVal) && topVal > 0 && topVal < 1) {
                topVal *= this.ch;
            }
            offsetTop.forEach((v, i, array) => {

                // topVal[i] || v: 当传入的topVal数组少于自身数组的长度，
                // 超出部分保持它的原有值，以保证不出现 undefined
                array[i] = isArray(topVal) ? ( topVal[i] || v ) : topVal;
            });
        }
    }

    createDots() {
        const {cw, rippleLength} = this;
        let {num} = this.set;
        let dots = this.dots = [];

        while (num--) {
            const line = dots[num] = [];

            // 点的y轴步进
            const step = twicePI / rippleLength[num];

            // 创建一条线段所需的点
            for (let i = 0; i < cw; i++) {
                line.push({
                    x: i,
                    y: i * step
                });
            }
        }
    }

    draw() {
        const {cxt, cw, ch, paused, set} = this;
        const {num, opacity} = set;

        if (num <= 0) return;

        cxt.clearRect(0, 0, cw, ch);
        cxt.globalAlpha = opacity;

        this.dots.forEach((line, i) => {
            const crestHeight = set.crestHeight[i];
            const offsetLeft = set.offsetLeft[i];
            const offsetTop = set.offsetTop[i];
            const speed = set.speed[i];

            cxt.save();
            cxt.beginPath();

            line.forEach((dot, j) => {
                cxt[j ? 'lineTo' : 'moveTo'](
                    dot.x,

                    // y = A sin ( ωx + φ ) + h
                    crestHeight * sin(dot.y + offsetLeft) + offsetTop
                );
                !paused && ( dot.y -= speed );
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

    resize() {
        utils.resize(this, (scaleX, scaleY) => {
            if (this.set.num > 0) {
                this.dots.forEach(line => {
                    line.forEach(dot => {
                        dot.x *= scaleX;
                        dot.y *= scaleY;
                    });
                });
            }
        })
    }
};