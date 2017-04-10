const {utils, Base} = JParticles;
const {pInt, limitRandom, calcSpeed, scaleValue} = utils;
const {getCss, offset, isElement, modifyPrototype} = utils;
const {random, abs, PI} = Math;
const twicePI = PI * 2;

/**
 * 检查元素或其祖先节点的属性是否等于预给值
 * @param elem {element} 起始元素
 * @param property {string} css属性
 * @param value {string} css属性值
 * @returns {boolean}
 */
function checkParentsProperty(elem, property, value) {
    while (elem = elem.offsetParent) {
        if (getCss(elem, property) === value) {
            return true;
        }
    }
    return false;
}

function eventHandler(eventType) {
    const {num, range, eventElem} = this.set;

    if (num > 0 && range > 0) {

        // 使用传递过来的关键字判断绑定事件还是移除事件
        eventType = eventType === 'pause' ? 'off' : 'on';
        utils[eventType](eventElem, 'mousemove', this.moveHandler);
        utils[eventType](eventElem, 'touchmove', this.moveHandler);
    }
}

JParticles.particle = class Particle extends Base {

    static defaultConfig = {

        // 粒子个数，默认为容器宽度的 0.12 倍
        // 传入 (0, 1) 显示容器宽度相应倍数的个数，传入 [1, +∞) 显示具体个数
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
        // 在 range 范围内的两点距离小于 distance，则两点之间连线
        distance: 130,

        // 线段的宽度
        lineWidth: .2,

        // 定位点的范围，范围越大连线越多，当 range 等于 0 时，不连线，相关值无效
        range: 160,

        // 改变定位点坐标的事件元素，null 表示 canvas 画布，或传入原生元素对象，如 document 等
        eventElem: null
    };

    constructor(selector, options) {
        super(Particle, selector, options);
    }

    init() {
        const {num, range, eventElem} = this.set;

        if (num > 0) {
            if (range > 0) {

                // 设置移动事件元素
                if (!isElement(eventElem) && eventElem !== document) {
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
    }

    createDots() {
        const {cw, ch, color} = this;
        const {num, maxR, minR, maxSpeed, minSpeed} = this.set;
        let realNumber = pInt(scaleValue(num, cw));
        let dots = this.dots = [];
        let r;

        while (realNumber--) {
            r = limitRandom(maxR, minR);
            dots.push({
                r,
                x: limitRandom(cw - r, r),
                y: limitRandom(ch - r, r),
                vx: calcSpeed(maxSpeed, minSpeed),
                vy: calcSpeed(maxSpeed, minSpeed),
                color: color()
            });
        }
    }

    draw() {
        const {cw, ch, cxt, paused} = this;
        const {num, range, lineWidth, opacity} = this.set;

        if (num <= 0) return;

        cxt.clearRect(0, 0, cw, ch);

        // 当canvas宽高改变的时候，全局属性需要重新设置
        cxt.lineWidth = lineWidth;
        cxt.globalAlpha = opacity;

        this.dots.forEach(dot => {
            const r = dot.r;

            cxt.save();
            cxt.beginPath();
            cxt.arc(dot.x, dot.y, r, 0, twicePI);
            cxt.fillStyle = dot.color;
            cxt.fill();
            cxt.restore();

            // 暂停的时候，vx和vy保持不变，
            // 处理自适应窗口变化时出现粒子移动的状态
            if (!paused) {
                dot.x += dot.vx;
                dot.y += dot.vy;

                const x = dot.x;
                const y = dot.y;

                if (x + r >= cw || x - r <= 0) {
                    dot.vx *= -1;
                }

                if (y + r >= ch || y - r <= 0) {
                    dot.vy *= -1;
                }
            }
        });

        // 当连接范围小于 0 时，不连接线段
        if (range > 0) {
            this.connectDots();
        }

        this.requestAnimationFrame();
    }

    connectDots() {
        const {dots, cxt, posX, posY} = this;
        const {distance, range} = this.set;
        const length = dots.length;

        dots.forEach((dot, i) => {
            const x = dot.x;
            const y = dot.y;
            const color = dot.color;

            while (++i < length) {
                const sibDot = dots[i];
                const sx = sibDot.x;
                const sy = sibDot.y;

                if (abs(x - sx) <= distance &&
                    abs(y - sy) <= distance &&
                    (abs(x - posX) <= range &&
                    abs(y - posY) <= range ||
                    abs(sx - posX) <= range &&
                    abs(sy - posY) <= range)) {
                    cxt.save();
                    cxt.beginPath();
                    cxt.moveTo(x, y);
                    cxt.lineTo(sx, sy);
                    cxt.strokeStyle = color;
                    cxt.stroke();
                    cxt.restore();
                }
            }
        });
    }

    getElemOffset() {
        return (this.elemOffset = this.elemOffset ? offset(this.set.eventElem) : null);
    }

    event() {
        const {eventElem} = this.set;

        if (eventElem !== document) {
            this.elemOffset = true;
        }

        // move 事件处理函数
        this.moveHandler = function (e) {
            this.posX = e.pageX;
            this.posY = e.pageY;

            // 动态计算 elemOffset 值
            if (this.getElemOffset()) {

                // 动态判断祖先节点是否具有固定定位，有则使用client计算
                if (checkParentsProperty(eventElem, 'position', 'fixed')) {
                    this.posX = e.clientX;
                    this.posY = e.clientY;
                }
                this.posX -= this.elemOffset.left;
                this.posY -= this.elemOffset.top;
            }
        }.bind(this);

        // 添加 move 事件
        eventHandler.call(this);
    }
};

let fn = JParticles.particle.prototype;
fn.version = '2.0.0';

// 修改原型 pause, open 方法
modifyPrototype(fn, 'pause, open', eventHandler);

// 修改原型 resize 方法
modifyPrototype(fn, 'resize', function (scaleX, scaleY) {
    const {num, range} = this.set;
    if (num > 0 && range > 0) {
        this.posX *= scaleX;
        this.posY *= scaleY;
        this.getElemOffset();
    }
});

