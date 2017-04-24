const {utils, Base} = JParticles;
const {random, abs, PI, sin, ceil} = Math;
const twicePI = PI * 2;
const UNDEFINED = 'undefined';
const {
    pInt, limitRandom, calcSpeed,
    scaleValue, randomColor, isArray,
    isFunction, isPlainObject, resize,
    defineReadOnlyProperty
} = utils;

class WaveLoading extends Base {

    static defaultConfig = {

        // [font style][font weight][font size][font family]
        // 文本样式，同css一样，必须包含 [font size] 和 [font family]
        font: 'normal 900 20px Arial',

        // 小字体样式，如：“%”
        smallFont: 'normal 900 14px Arial',

        // 小字体相对于中点向下的偏移值，
        // 细节的处理，为了让显示更好看。
        smallFontOffsetTop: 1,

        // 文本颜色
        color: '#333',

        // 填充的背景色
        fillColor: '#27C9E5',

        // 线条横向偏移值，距离canvas画布左边的偏移值
        // (0, 1)表示容器宽度的倍数，0 & [1, +∞)表示具体数值
        offsetLeft: 0,

        // 波峰高度，(0, 1)表示容器高度的倍数，0 & [1, +∞)表示具体数值
        crestHeight: 4,

        // 波纹个数，即正弦周期个数
        rippleNum: 1,

        // 波浪的运动速度
        speed: .3,

        // 加载到 99% 的时长，单位毫秒(ms)
        // 用时越久，越慢加载到 99%。
        duration: 2000,

        // 加载过程的运动效果，
        // 目前支持匀速(linear)，先加速再减速(swing)，两种
        easing: 'swing'
    };

    get version() {
        return '3.0.0';
    }

    constructor(selector, options) {
        super(WaveLoading, selector, options);
    }

    init() {
        this.c.style.borderRadius = '50%';
        this.progress = 0;
        this.set.offsetTop = this.ch;
        this.halfCH = this.ch / 2;
        this.attrNormalize();
        this.createDots();
        this.draw();
    }

    attrNormalize() {
        ['offsetLeft', 'crestHeight'].forEach(attr => {
            this.set[attr] = scaleValue(
                this.set[attr],
                'offsetLeft' ? this.cw : this.ch
            );
        });
    }

    createDots() {
        const {cw} = this;
        const dots = this.dots = [];

        // 线条波长，每个周期(2π)在canvas上的实际长度
        const rippleLength = cw / this.set.rippleNum;

        // 点的y轴步进
        const step = twicePI / rippleLength;

        // 一条线段所需的点
        for (let i = 0; i <= cw; i++) {
            dots.push({
                x: i,
                y: i * step
            });
        }
    }

    draw() {
        this._setOffsetTop();

        const {cxt, cw, ch, paused} = this;
        const {
            opacity, crestHeight, offsetLeft,
            offsetTop, fillColor, speed
        } = this.set;

        cxt.clearRect(0, 0, cw, ch);
        cxt.globalAlpha = opacity;
        cxt.save();
        cxt.beginPath();

        this.dots.forEach((dot, i) => {
            cxt[i ? 'lineTo' : 'moveTo'](
                dot.x,

                // y = A sin ( ωx + φ ) + h
                crestHeight * sin(dot.y + offsetLeft) + offsetTop
            );
            !paused && ( dot.y -= speed );
        });

        cxt.lineTo(cw, ch);
        cxt.lineTo(0, ch);
        cxt.closePath();
        cxt.fillStyle = fillColor;
        cxt.fill();
        cxt.restore();

        this.drawText();

        if (!this.paused) {
            this.progress += 0.5;
        }

        if (this.progress >= 99) {
            this.progress = 99;
        }

        this.requestAnimationFrame();
    }

    drawText() {
        const {cxt, cw, halfCH, progress} = this;
        let {
            font, smallFont, color,
            smallFontOffsetTop
        } = this.set;

        let percentText = '%';
        let progressText = ceil(progress);

        if (this.progressListeners) {
            const res = this.progressListeners(this.progress);
            if (typeof res !== UNDEFINED) {
                if (isPlainObject(res)) {
                    progressText = res.text;
                    percentText = res.smallText || '';
                } else {
                    progressText = res;
                    percentText = '';
                }
            }
        }

        cxt.font = font;
        const progressWidth = cxt.measureText(progressText).width;

        cxt.font = smallFont;
        const percentWidth = cxt.measureText(percentText).width;

        const x = (cw - progressWidth - percentWidth) / 2;

        cxt.textBaseline = 'middle';
        cxt.fillStyle = color;
        cxt.font = font;
        cxt.fillText(progressText, x, halfCH);
        cxt.font = smallFont;
        cxt.fillText(
            percentText,
            x + progressWidth,
            halfCH + smallFontOffsetTop
        );
    }

    _setOffsetTop() {
        if (!this.paused) {
            this.set.offsetTop = ceil(
                (100 - this.progress) / 100 * this.ch + this.set.crestHeight
            );
        }
    }

    resize() {
        resize(this, () => {
            this.halfCH = this.ch / 2;
        });
    }

    setOptions(newOptions) {
        if (isPlainObject(newOptions)) {
            for (const name in newOptions) {
                if (name !== 'offsetTop' && (name in this.set)) {
                    this.set[name] = newOptions[name];
                }
            }
        }
    }

    done() {
        this.paused ? this.open() : this.pause();
    }

    onProgress(callback) {
        if (isFunction(callback)) {
            this.progressListeners = callback;
        }
    }
}

defineReadOnlyProperty(WaveLoading, 'waveLoading');