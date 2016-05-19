$(function(){
    function setActive( $parent, $this ){
        $parent.find('.active').removeClass('active');
        $this.addClass('active');
    }

    function nav(){
        var $nav = $('.header .nav');
        var $active = $nav.find('.active');
        var $slideblock = $nav.find('.slideblock');

        setSlideblock( $active );
        setTimeout(function(){
            $slideblock.addClass('animation').removeClass('hidden');
        }, 0 );

        $nav.find('a').hover(function(){
            changeActive( $(this) );
        }, function(){
            changeActive( $active );
        });

        function changeActive( $el ){
            setActive( $nav, $el );
            setSlideblock( $el );
        }

        function setSlideblock( $el ){
            var l = $el.position().left + parseInt($el.css('paddingLeft')) + .5;
            $slideblock.css({
                width: $el.width(),
                transform: 'translate('+ l +'px,0)'
            });
        }
    }
    nav();

});