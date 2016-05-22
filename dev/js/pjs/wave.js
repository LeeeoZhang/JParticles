//snow.js
+function ( win, Particleground ) {
    'use strict';

    var util = Particleground.util,
        random = Math.random,
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
        //雪花颜色
        color: '#fff',
        //雪花最大半径
        max: 6.5,
        //雪花最小半径
        min: .4,
        //运动速度
        speed: .4,
        //自适应窗口尺寸变化
        resize: true
    };

    Wave.prototype = {
        version: '1.0.0',
        createDot: function(){

        },
        draw: function(){
            var self = this,
                set = self.set,
                cxt = self.cxt,
                cw = self.cw,
                ch = self.ch,
                dots = self.dots;

            cxt.clearRect( 0, 0, cw, ch );

            //当canvas宽高改变的时候，全局属性需要重新设置
            if( set.resize ){
                cxt.fillStyle = set.color;
                cxt.globalAlpha = set.opacity;
            }

            cxt.strokeStyle ="#FF5D43";
            cxt.beginPath();
            cxt.moveTo(0,200);
            cxt.quadraticCurveTo(150,100,300,200);
            cxt.quadraticCurveTo(450,300,600,200);
            cxt.stroke();

            //this.requestAnimationFrame();
        }
    };

    //继承公共方法，如pause，open
    Particleground.extend( Wave.prototype );
    //添加实例
    Particleground.wave = Wave.prototype.constructor = Wave;
}( window, Particleground );