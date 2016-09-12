// wave.js
+function ( win, Particleground ) {
    'use strict';

    var util = Particleground.util,
        random = Math.random,
        sin = Math.sin,
        pi2 = Math.PI * 2,
        UNDEFINED = 'undefined',
        isArray = Array.isArray;

    function Wave( selector, options ){
        util.createCanvas( this, Wave, selector, options );
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


    Wave.prototype = {
        version: '1.0.0',
        init: function(){
            this.initAttr();
            this.createDot();
            this.draw();
            this.resize();
        },
        initAttr: function(){
            var self = this;
            var cw = self.cw;
            var ch = self.ch;
            var set = self.set;
            var randomColor = util.randomColor;
            var limitRandom = util.limitRandom;

            // 线条数量
            var num = set.num = set.num || limitRandom( ch / 2, 1 );

            // 线条波长，每个周期(2π)在canvas上的实际长度
            var rippleLength = this.rippleLength = [];

            [
                'lineColor', 'fillColor', 'lineWidth',
                'offsetLeft', 'offsetTop', 'crestHeight',
                'rippleNum', 'speed', 'fill', 'stroke'
            ]
            .forEach(function( attr ){
                self.attrNormalize( attr );
            });
        },
        getAttr: function(){
            switch ( attr ){
                case 'lineColor':
                case 'fillColor':
                    attr = randomColor();
                    break;
                case 'lineWidth':
                    attr = limitRandom( 2, .2 );
                    break;
                case 'offsetLeft':
                    attr = random() * cw;
                    break;
                case 'offsetTop':
                case 'crestHeight':
                    attr = random() * ch;
                    break;
                case 'rippleNum':
                    attr = limitRandom( cw / 2, 1 );
                    rippleLength.push( cw / attr );
                    break;
                case 'speed':
                    attr = limitRandom( .4, .1 );
                    break;
                case 'area':
                    attr = false;
                    break;
                case 'stroke':
                    attr = true;
                    break;
            }
            return attr;
        },
        attrNormalize: function(){
            var val = set[ attr ];
            if( isArray( val ) ){
                // 将crest: []或[2]或[2, 2], 转换成crest: [2, 2, 2]
                if( attr === 'offsetTop' || attr === 'crestHeight' ||  attr === 'offsetLeft' ){
                    var arg = attr === 'offsetLeft' ? cw : ch;
                    for( var i = 0; i < num; i++ ){
                        val[i] = typeof val[i] === UNDEFINED ?
                            getAttr( attr ) : scale( val[i], arg );
                    }
                }else if( val.length < num ){
                    for( var i = 0, len = num - val.length; i < len; i++ ){
                        val.push( getAttr( attr ) );
                    }
                }
            }else {
                set[ attr ] = [];
                // 将crest: 2, 转换成crest: [2, 2, 2]
                if( typeof val === 'number' || typeof val === 'boolean' ||
                    typeof val === 'string' ){
                    for( var i = 0; i < num; i++ ){
                        if( attr === 'offsetTop' || attr === 'crestHeight' ){
                            val = scale( val, ch );
                        }else if( attr === 'offsetLeft' ){
                            val = scale( val, cw );
                        }else if( attr === 'rippleNum' ){
                            rippleLength.push( cw / val );
                        }
                        set[ attr ].push( val );
                    }
                }
            }
        },
        setOffsetTop: function( topVal ){
            if( isArray( topVal ) ){
                // 如果传入的topVal数组少于自身数组的长度，则保持它的原有值，以保证不出现undefined
                this.set.offsetTop.forEach(function( v, i, array ){
                    array[ i ] = topVal[ i ] || v;
                });
            }else{
                if( topVal > 0 && topVal < 1 ){
                    topVal *= this.ch;
                }
                this.set.offsetTop.forEach(function( v, i, array ){
                    array[ i ] = topVal;
                });
            }
        },
        createDot: function(){
            var set = this.set,
                cw = this.cw,
                lineNum = set.num,
                dots = [];

            for( var i = 0; i < lineNum; i++ ){

                var	line = [];
                // 一个点的高度
                var step = pi2 / this.rippleLength[i];

                // 创建一条线段所需的点
                for( var j = 0; j < cw; j++ ){
                    line.push({
                        x: j,
                        y: j * step
                    });
                }

                dots.push( line );

            }
            this.dots = dots;
        },
        draw: function(){
            var cxt = this.cxt,
                cw = this.cw,
                ch = this.ch,
                set = this.set;

            cxt.clearRect( 0, 0, cw, ch );
            cxt.globalAlpha = set.opacity;

            this.dots.forEach(function( lineDots, i ){
                cxt.save();
                cxt.beginPath();

                var crestHeight = set.crestHeight[i];
                var offsetLeft = set.offsetLeft[i];
                var offsetTop = set.offsetTop[i];
                var speed = set.speed[i];
                lineDots.forEach(function( v, j ){
                    cxt[ j ? 'lineTo' : 'moveTo'](
                        v.x,
                        // y = A sin（ ωx + φ ）+ h
                        crestHeight * sin( v.y + offsetLeft ) + offsetTop
                    );
                    v.y -= speed;
                });
                if( set.area[i] ){
                    cxt.lineTo( cw, ch );
                    cxt.lineTo( 0, ch );
                    cxt.closePath();
                    cxt.fillStyle = set.fillColor[i];
                    cxt.fill();
                }
                if( set.stroke[i] ){
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
    Particleground.extend( Wave.prototype );

    // 添加实例
    Particleground.wave = Wave.prototype.constructor = Wave;

}( window, Particleground );