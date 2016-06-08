//snow.js
+function ( win, Particleground ) {
    'use strict';

    var util = Particleground.util,
        random = Math.random,
        sin = Math.sin,
        pi2 = Math.PI * 2;

    function Wave( selector, options ){
        if( !util.createCanvas( selector, this ) ){
            return;
        }
        this.set = util.extend( {}, Wave.configDefault, options );

        this.dots = [];
        this.initAttr();
        this.createDot();
        this.draw();
        this.resize();
    }

    Wave.configDefault = {
        //全局透明度
        opacity: 1,
        //线条颜色
        //color: [],
        color: ['rgba(0, 190, 112, .9)', 'rgba(0, 190, 112, .6)', 'rgba(0, 190, 112, .3)'],
        //线条个数
        num: 3,
        //线条宽度
        lineWidth: 1,
        //线条中点到元素顶部的距离，(0, 1]表示容器的倍数，(1, +∞)表示具体数值
        offsetTop: .75,
        //波峰数值，(0, 1]表示容器的倍数，(1, +∞)表示具体数值
        //crest:.3,
        crest: [16, 12, 8],
        //波纹个数，即正弦周期个数
        rippleNum: [2, 2, 2],
        //线段的横向偏移值
        offsetLeft: [.1, 1, 2],
        //运动速度
        //speed: [.1, .1, .1],
        speed: [.07, .07, .07],
        //自适应窗口尺寸变化
        resize: true
    };


    Wave.prototype = {
        version: '1.0.0',
        initAttr: function(){
            var set = this.set;
            var num = set.num;
            var isArray = Array.isArray;

            attrNormalize( 'color' );
            attrNormalize( 'lineWidth' );
            attrNormalize( 'offsetTop' );

            function attrNormalize( attr ){
                var val = set[ attr ];
                if( !isArray( val ) ){
                    set[ attr ] = [];
                    if( typeof val === 'number' ){
                        for( var i = 0; i < num; i++ ){
                            set[ attr ].push( val );
                        }
                    }
                }
                //是一个数组可能只写了一个参数
            }
        },
        setAttr: function( attr ){
            switch ( attr ){
                case 'color':
                    attr = util.randomColor();
                    break;
                case 'lineWidth':
                    attr = 1;
                    break;
                case 'offsetLeft':
                    attr = random() * this.rippleLength[i];
                    break;
                case 'speed':
                    attr = util.limitRandom(.4, .2);
                    break;
            }
            return attr;
        },
        getAttr: function( attr, i ){
            var set = this.set;
            var val = set[attr][i];
            if( typeof val === 'undefined' ){
                switch ( attr ){
                    case 'color':
                        val = util.randomColor();
                        break;
                    case 'lineWidth':
                        val = 1;
                        break;
                    case 'offsetLeft':
                        val = random() * this.rippleLength[i];
                        break;
                    case 'speed':
                        val = util.limitRandom(.4, .2);
                        break;
                }
                set[attr].push( val );
            }
            return val;
        },
        createDot: function(){
            var set = this.set,
                cw = this.cw,
                ch = this.ch,
                lineNum = set.num,
                dots = [];

            this.rippleLength = [];

            for( var i = 0; i < lineNum; i++ ){

                //每个周期(2π)在canvas上的实际长度
                var rippleLength = cw / set.rippleNum[i];
                //一个点的高度
                var step = pi2 / rippleLength;

                this.rippleLength.push( rippleLength );


                var	line = [];
                var h = set.offsetTop;
                if( h > 0 && h <= 1 ){
                    //10 * i不够随机
                    h = h * ch;
                }

                //创建一条线段所需的点
                for( var j = 0; j < cw; j++ ){
                    line.push({
                        x: j,
                        y: j * step,
                        h: h
                    });
                }

                dots.push( line );

            }
            this.dots = dots;
        },
        draw: function(){
            var self = this,
                set = this.set,
                speed = set.speed,
                cxt = this.cxt,
                cw = this.cw,
                ch = this.ch;

            cxt.clearRect( 0, 0, cw, ch );
            cxt.globalAlpha = set.opacity;

            this.dots.forEach(function( lineDots, i ){
                cxt.save();
                cxt.beginPath();
                var crest = set.crest;
                if( crest > 0 && crest <= 1 ){
                    crest = crest * ch;
                }

                lineDots.forEach(function( v, j ){
                    if( j ){
                        //y = A sin（ ωx + φ ）+ h
                        cxt.lineTo( v.x,
                self.getAttr( 'crest', i ) * sin( v.y + self.getAttr( 'offsetLeft', i ) ) + v.h
                        );
                    }else{
                        cxt.moveTo( v.x,
                self.getAttr( 'crest', i ) * sin( v.y + self.getAttr( 'offsetLeft', i ) ) + v.h
                        );
                    }
                    //v.y = v.y - .1;
                    v.y -= self.getAttr( 'speed', i );
                });
                /*cxt.moveTo( cw, ch );
                cxt.moveTo( 0, ch );*/
                //cxt.fill = 'red';
                cxt.strokeStyle = self.getAttr( 'color', i );

                cxt.lineWidth = self.getAttr( 'lineWidth', i );
                cxt.stroke();
                //cxt.closePath();
                cxt.restore();
            });

            this.requestAnimationFrame();
        }
    };

    //继承公共方法，如pause，open
    Particleground.extend( Wave.prototype );
    //添加实例
    Particleground.wave = Wave.prototype.constructor = Wave;
}( window, Particleground );