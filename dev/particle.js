const {utils, Base} = JParticles;
const {random, abs, PI, ceil} = Math;
const twicePI = PI * 2;
const {
    pInt, limitRandom, calcSpeed, scaleValue,
    getCss, offset, isElement, isFunction,
    defineReadOnlyProperty
} = utils;

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

class Particle extends Base {

    static defaultConfig = {

        // 粒子个数，默认为容器宽度的 0.12 倍
        // (0, 1) 显示为容器宽度相应倍数的个数，0 & [1, +∞) 显示具体个数
        // 0 是没有意义的，下同
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
        // 在 range 范围内的两点距离小于 proximity，则两点之间连线
        proximity: 130,

        // 定位点的范围，范围越大连线越多
        // 当 range 等于 0 时，不连线，相关值无效
        range: 160,

        // 线段的宽度
        lineWidth: .2,

        // 连线的形状
        // spider: 散开的蜘蛛状
        // cube: 合拢的立方体状
        lineShape: 'spider',

        // 改变定位点坐标的事件元素
        // null 表示 canvas 画布，或传入原生元素对象，如 document 等
        eventElem: null,

        // 视差效果
        parallax: false,

        // 视差景深，值越小视差效果越强烈
        parallaxPerspective: 3
    };

    get version() {
        return '3.0.0';
    }

    constructor(selector, options) {
        super(Particle, selector, options);
    }

    init() {
        const {num, range, eventElem} = this.set;

        if (num > 0) {

            // 设置触发事件的元素
            if (!isElement(eventElem) && eventElem !== document) {
                this.set.eventElem = this.c;
            }

            if (range > 0) {

                // 定位点坐标
                this.positionX = random() * this.cw;
                this.positionY = random() * this.ch;
                this.defineLineShape();
                this.positionEvent();
            }

            // 初始化鼠标在视差上的坐标
            this.mouseX = this.mouseY = 0;

            this.createDots();
            this.draw();
            this.parallaxEvent();
        }
    }

    defineLineShape() {
        const {proximity, range, lineShape} = this.set;
        switch (lineShape) {
            case 'cube':
                this.lineShapeMaker = (x, y, sx, sy, cb) => {
                    const {positionX, positionY} = this;
                    if (
                        abs(x - sx) <= proximity &&
                        abs(y - sy) <= proximity &&
                        abs(x - positionX) <= range &&
                        abs(y - positionY) <= range &&
                        abs(sx - positionX) <= range &&
                        abs(sy - positionY) <= range
                    ) {
                        cb();
                    }
                };
                break;
            default:
                this.lineShapeMaker = (x, y, sx, sy, cb) => {
                    const {positionX, positionY} = this;
                    if (
                        abs(x - sx) <= proximity &&
                        abs(y - sy) <= proximity &&
                        (
                            abs(x - positionX) <= range &&
                            abs(y - positionY) <= range ||
                            abs(sx - positionX) <= range &&
                            abs(sy - positionY) <= range
                        )
                    ) {
                        cb();
                    }
                };
        }
    }

    createDots() {
        const {cw, ch, color} = this;
        const {num, maxR, minR, maxSpeed, minSpeed} = this.set;
        let realNumber = pInt(scaleValue(num, cw));
        let dots = this.dots = [];

        while (realNumber--) {
            let r = limitRandom(maxR, minR);
            dots.push({
                r,
                x: limitRandom(cw - r, r),
                y: limitRandom(ch - r, r),
                vx: calcSpeed(maxSpeed, minSpeed),
                vy: calcSpeed(maxSpeed, minSpeed),
                color: color(),

                // 定义粒子在视差图层里的层级关系
                // 值越小视差效果越强烈：1, 2, 3
                layer: ceil(limitRandom(3, 1)),

                // 定义粒子视差的偏移值
                parallaxOffsetX: 0,
                parallaxOffsetY: 0
            });
        }
    }

    draw() {
        const {cw, ch, cxt} = this;
        const {num, range, lineWidth, opacity} = this.set;

        if (num <= 0) return;

        cxt.clearRect(0, 0, cw, ch);

        // 当canvas宽高改变的时候，全局属性需要重新设置
        cxt.lineWidth = lineWidth;
        cxt.globalAlpha = opacity;

        // 更新粒子坐标
        this.updateXY();

        // 绘制粒子
        this.dots.forEach(dot => {
            const {x, y, r, parallaxOffsetX, parallaxOffsetY} = dot;
            cxt.save();
            cxt.beginPath();
            cxt.arc(
                x + parallaxOffsetX,
                y + parallaxOffsetY,
                r, 0, twicePI
            );
            cxt.fillStyle = dot.color;
            cxt.fill();
            cxt.restore();
        });

        // 当连接范围小于 0 时，不连接线段
        if (range > 0) {
            this.connectDots();
        }

        this.requestAnimationFrame();
    }

    connectDots() {
        const {dots, cxt, lineShapeMaker} = this;
        const length = dots.length;

        dots.forEach((dot, i) => {
            const x = dot.x + dot.parallaxOffsetX;
            const y = dot.y + dot.parallaxOffsetY;

            while (++i < length) {
                const sibDot = dots[i];
                const sx = sibDot.x + sibDot.parallaxOffsetX;
                const sy = sibDot.y + sibDot.parallaxOffsetY;

                lineShapeMaker(x, y, sx, sy, () => {
                    cxt.save();
                    cxt.beginPath();
                    cxt.moveTo(x, y);
                    cxt.lineTo(sx, sy);
                    cxt.strokeStyle = dot.color;
                    cxt.stroke();
                    cxt.restore();
                });
            }
        });
    }

    updateXY() {
        const {paused, mouseX, mouseY, cw, ch} = this;
        const {parallax, parallaxPerspective} = this.set;

        this.dots.forEach(dot => {

            // 暂停的时候，vx 和 vy 保持不变，
            // 防止自适应窗口变化时出现粒子移动
            if (!paused) {

                if (parallax) {

                    // https://github.com/jnicol/particleground
                    const divisor = parallaxPerspective * dot.layer;
                    dot.parallaxOffsetX += (mouseX / divisor - dot.parallaxOffsetX) / 10;
                    dot.parallaxOffsetY += (mouseY / divisor - dot.parallaxOffsetY) / 10;
                }

                dot.x += dot.vx;
                dot.y += dot.vy;

                let {x, y, r, parallaxOffsetX, parallaxOffsetY} = dot;
                x += parallaxOffsetX;
                y += parallaxOffsetY;

                // 自然碰撞反向，事件移动反向
                if (x + r >= cw) {
                    dot.vx = -abs(dot.vx);
                } else if (x - r <= 0) {
                    dot.vx = abs(dot.vx);
                }

                if (y + r >= ch) {
                    dot.vy = -abs(dot.vy);
                } else if (y - r <= 0) {
                    dot.vy = abs(dot.vy);
                }
            }
        });
    }

    setElemOffset() {
        return (
            this.elemOffset = this.set.eventElem === document
                ? null
                : offset(this.set.eventElem)
        );
    }

    positionEvent() {
        const {eventElem, range} = this.set;

        // 性能优化
        if (range > this.cw && range > this.ch) return;

        // 更新定位点的坐标
        const updatePositionHandler = e => {
            if (this.paused) return;

            this.positionX = e.pageX;
            this.positionY = e.pageY;

            // 动态计算 elemOffset 值
            if (this.setElemOffset()) {

                // 动态判断祖先节点是否具有固定定位，有则使用 client 计算
                if (checkParentsProperty(eventElem, 'position', 'fixed')) {
                    this.positionX = e.clientX;
                    this.positionY = e.clientY;
                }
                this.positionX -= this.elemOffset.left;
                this.positionY -= this.elemOffset.top;
            }
        };

        utils.on(eventElem, 'mousemove', updatePositionHandler);
        this.onDestroy(() => {
            utils.off(eventElem, 'mousemove', updatePositionHandler);
        });
    }

    parallaxEvent() {
        const {parallax, eventElem} = this.set;
        if (!parallax) return;

        const parallaxHandler = e => {
            if (this.paused) return;

            let left = e.pageX;
            let top = e.pageY;

            if (this.setElemOffset()) {

                // 动态判断祖先节点是否具有固定定位，有则使用 client 计算
                if (checkParentsProperty(eventElem, 'position', 'fixed')) {
                    left = e.clientX;
                    top = e.clientY;
                }
                left -= this.elemOffset.left;
                top -= this.elemOffset.top;
            }

            const {cw, ch} = this;
            this.mouseX = left - cw / 2;
            this.mouseY = top - ch / 2;
        };

        utils.on(eventElem, 'mousemove', parallaxHandler);
        this.onDestroy(() => {
            utils.off(eventElem, 'mousemove', parallaxHandler);
        });
    }

    resize() {
        utils.resize(this, (scaleX, scaleY) => {
            const {num, range} = this.set;
            if (num > 0 && range > 0) {
                this.positionX *= scaleX;
                this.positionY *= scaleY;
            }
        });
    }
}

// 挂载插件到 JParticles 对象上。
defineReadOnlyProperty(Particle, 'particle');