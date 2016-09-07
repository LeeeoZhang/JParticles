// particle.js
+function ( win, Particleground ) {
    'use strict';

    var util = Particleground.util,
        event = Particleground.event,
        random = Math.random,
        abs = Math.abs,
        pi2 = Math.PI * 2;

    /**
     * 元素及其祖先节点属性判断
     * @param elem {element} 起始元素
     * @param property {string} css属性
     * @param value {string} css属性值
     * @returns {boolean}
     */
    function checkParentsProperty( elem, property, value ){
        var getCss = util.getCss;
        while ( elem = elem.offsetParent ){
            if( getCss( elem, property ) === value ){
                return true;
            }
        }
        return false;
    }

    function eventHandler( eventType ){
        var context = this;
        if( context.set.range > 0 ){
            // 使用传递过来的关键字判断绑定事件还是移除事件
            eventType = eventType === 'pause' ? 'off' : 'on';
            event[ eventType ]( context.set.eventElem, 'mousemove', context.moveHandler );
            event[ eventType ]( context.set.eventElem, 'touchmove', context.moveHandler );
        }
    }

    function Particle( selector, options ){
        util.createCanvas( this, Particle, selector, options );
    }

    Particle.defaultConfig = {
        // 粒子颜色，null随机色，或随机给定数组的颜色
        color: null,
        // 粒子运动速度
        speed: 1,
        // 粒子个数，默认为容器宽度的0.12倍
        // 传入(0, 1)显示容器宽度相应倍数的个数，传入[1, +∞)显示具体个数
        num: .12,
        // 粒子最大半径
        max: 2.4,
        // 粒子最小半径
        min: .6,
        // 两点连接线段的最大值
        // 在range范围内的两点距离小于dis，则两点之间连接一条线段
        dis: 130,
        // 线段的宽度
        lineWidth: .2,
        // 定位点的范围，范围越大连接的点越多，当range等于0时，不连接线段，相关值无效
        range: 160,
        // 改变定位点坐标的事件元素，null表示canvas画布，或传入原生元素对象，如document等
        eventElem: null
    };

    var fn = Particle.prototype = {
        version: '1.0.0',
        init: function(){
            if( this.set.num > 0 ){
                if( this.set.range > 0 ){

                    // 设置移动事件元素
                    if( !util.isElem( this.set.eventElem ) && this.set.eventElem !== document ){
                        this.set.eventElem = this.c;
                    }

                    // 定位点坐标
                    this.posX = random() * this.cw;
                    this.posY = random() * this.ch;
                    this.event();
                }
                this.createDot();
                this.draw();
                this.resize();
            }
        },
        createDot: function(){
            var cw = this.cw,
                ch = this.ch,
                set = this.set,
                limitRandom = util.limitRandom,
                speed = set.speed,
                max = set.max,
                min = set.min,
                num = util.pInt( util.scaleValue( set.num, cw ) ),
                dots = [], r;

            while ( num-- ){
                r = limitRandom( max, min );
                dots.push({
                    x: limitRandom( cw - r, r ),
                    y: limitRandom( ch - r, r ),
                    r: r,
                    vx: limitRandom( speed, -speed * .5 ) || speed,
                    vy: limitRandom( speed, -speed * .5 ) || speed,
                    // 涉及到指向，加对象调用
                    color: this.color()
                });
            }

            this.dots = dots;
        },
        draw: function(){
            var set = this.set;
            var cw = this.cw;
            var ch = this.ch;
            var cxt = this.cxt;
            var paused = this.paused;

            cxt.clearRect( 0, 0, cw, ch );

            // 当canvas宽高改变的时候，全局属性需要重新设置
            cxt.lineWidth = set.lineWidth;
            cxt.globalAlpha = set.opacity;

            this.dots.forEach(function( v ){
                var r = v.r;
                cxt.save();
                cxt.beginPath();
                cxt.arc( v.x, v.y, r, 0, pi2 );
                cxt.fillStyle = v.color;
                cxt.fill();
                cxt.restore();

                // 暂停的时候，vx和vy保持不变，这样自适应窗口变化的时候不会出现粒子移动的状态
                if( !paused ){
                    v.x += v.vx;
                    v.y += v.vy;

                    var	x = v.x;
                    var y = v.y;

                    if( x + r >= cw || x - r <= 0 ){
                        v.vx *= -1;
                    }
                    if( y + r >= ch || y - r <= 0 ){
                        v.vy *= -1;
                    }
                }
            });

            // 当连接范围小于0时，不连接线段，可以做出球体运动效果
            if( set.range > 0 ){
                this.connectDot();
            }

            this.requestAnimationFrame();
        },
        connectDot:function(){
            var cxt = this.cxt,
                set = this.set,
                dis = set.dis,
                posX = this.posX,
                posY = this.posY,
                posR = set.range,
                dots = this.dots;

            dots.forEach(function ( v ) {
                var vx = v.x;
                var vy = v.y;
                if( abs( vx - posX ) <= posR &&
                    abs( vy - posY ) <= posR ){
                    dots.forEach(function ( sib ) {
                        var sx = sib.x,
                            sy = sib.y;
                        if( abs( vx - sx ) <= dis &&
                            abs( vy - sy ) <= dis ){
                            cxt.save();
                            cxt.beginPath();
                            cxt.moveTo( vx, vy );
                            cxt.lineTo( sx, sy );
                            cxt.strokeStyle = v.color;
                            cxt.stroke();
                            cxt.restore();
                        }
                    });
                }
            });
        },
        getElemOffset: function(){
            return (this.elemOffset = this.elemOffset ? util.offset( this.set.eventElem ) : null);
        },
        event: function() {
            if( this.set.eventElem !== document ){
                this.elemOffset = true;
            }

            // move事件处理函数
            this.moveHandler = function ( e ) {
                this.posX = e.pageX;
                this.posY = e.pageY;

                // 动态计算 elemOffset 值
                if( this.getElemOffset() ){

                    // 动态判断祖先节点是否具有固定定位，有则使用client计算
                    if( checkParentsProperty( this.set.eventElem, 'position', 'fixed' ) ){
                        this.posX = e.clientX;
                        this.posY = e.clientY;
                    }
                    this.posX -= this.elemOffset.left;
                    this.posY -= this.elemOffset.top;
                }
            }.bind( this );

            // 添加move事件
            eventHandler.call( this );
        }
    };

    // 继承公共方法，如pause，open
    Particleground.extend( fn );

    util.modifyPrototype( fn, 'pause, open', eventHandler );

    util.modifyPrototype( fn, 'resize', function( scaleX, scaleY ){
        if( this.set.range > 0 ){
            this.posX *= scaleX;
            this.posY *= scaleY;
            this.getElemOffset();
        }
    });

    /**
     * 原型方法 color 可否优化，不然每次都得带上 this 指向，不能单纯的使用，预先初始化一次或许可以搞定
     * connectDot 连接线嵌套循环算法优化
     */

    // 添加实例
    Particleground.particle = fn.constructor = Particle;

}( window, Particleground );

