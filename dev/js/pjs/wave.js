//snow.js
+function ( win, Particleground ) {
    'use strict';

    var util = Particleground.util,
        random = Math.random,
        sin = Math.sin,
        radian = Math.PI / 180,
        pi2 = Math.PI * 2;

    function Wave( selector, options ){
        if( !util.createCanvas( selector, this ) ){
            return;
        }
        this.set = util.extend( {}, Wave.configDefault, options );

        this.dots = [];
        this.createDot();
        this.draw();
        this.resize();
    }

    Wave.configDefault = {
        //全局透明度
        opacity: 1,
        //线条颜色
        color: [],
        //color: ['rgba(0, 190, 112, .9)', 'rgba(0, 190, 112, .6)', 'rgba(0, 190, 112, .3)'],
        //线条个数
        num: 3,
        //线条宽度
        lineWidth: [],
        //线条中点到元素顶部的距离，(0, 1]表示容器的倍数，(1, +∞)表示具体数值
        offsetTop: .75,
        //波峰数值，(0, 1]表示容器的倍数，(1, +∞)表示具体数值
        crest: .03,
        //波纹个数，即正弦周期个数
        rippleNum: 6,
        //线段的横向偏移值
        offsetLeft: [],
        //运动速度
        speed: 6,
        //自适应窗口尺寸变化
        resize: true
    };


    Wave.prototype = {
        version: '1.0.0',
        createDot: function(){
            var set = this.set,
                ch = this.ch,
                lineNum = set.num,
                dotsNum = this.cw,
                dots = [];

            //每个周期(2π)在canvas上的实际长度
            this.rippleLength = this.cw / set.rippleNum;
            //周期
            var t = pi2 / this.rippleLength;

            for( var i = 0; i < lineNum; i++ ){

                var	line = [];
                var y = set.offsetTop;
                if( y > 0 && y <= 1 ){
                    y = y * ch + 10 * i;
                }

                //线段的横向偏移值
                set.offsetLeft.push( random() * t );

                for( var j = 0; j < dotsNum; j++ ){
                    line.push({
                        x: j,
                        y: y,
                        angle: j * t
                    });
                }

                dots.push( line );

            }

            this.dots = dots;
        },
        getAttr: function( attr, i ){
            var set = this.set;
            var val = set[attr][i];
            if( !val ){
                switch ( attr ){
                    case 'color':
                        val = util.randomColor();
                        break;
                    case 'lineWidth':
                        val = 1;
                        break;
                }
                set[attr].push( val );
            }
            return val;
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

                //var rippleLength = cw / set.rippleNum / pi2;

                lineDots.forEach(function( v, j ){
                    if( j ){
                        //y = A sin（ ωx + φ ）+ h
                        cxt.lineTo( v.x,
                crest * sin( v.angle + self.getAttr( 'offsetLeft', i ) ) + v.y
                        );
                    }else{
                        cxt.moveTo( v.x,
                crest * sin( v.angle + self.getAttr( 'offsetLeft', i ) ) + v.y
                        );
                    }
                    v.angle += speed;
                });
                cxt.moveTo( cw, ch );
                cxt.moveTo( 0, ch );
                cxt.fill = 'red';
                cxt.strokeStyle = self.getAttr( 'color', i );

                cxt.lineWidth = self.getAttr( 'lineWidth', i );
                cxt.stroke();
                cxt.closePath();
                cxt.restore();
            });

            //this.requestAnimationFrame();
        }
    };

    //继承公共方法，如pause，open
    Particleground.extend( Wave.prototype );
    //添加实例
    Particleground.wave = Wave.prototype.constructor = Wave;
}( window, Particleground );