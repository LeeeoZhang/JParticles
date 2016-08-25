/*

document.addEventListener( 'click', function( event ){

    var target = event.target;

    if( target.getAttribute('data-open') !== null ){

        console.log( target.parentNode.previousSibling )
        console.log( target.parentNode.previousSibling.effect )

        target.parentNode.previousSibling.effect.open();

    }else if( target.getAttribute('data-pause') !== null ){

        target.parentNode.previousSibling.effect.pause();

    }

});
*/

function bind( id, run ){
    var effect = run();
    var btnBox = document.querySelector(id).nextElementSibling;
    btnBox.querySelector('[data-open]').onclick = function(){
        effect.open();
    };
    btnBox.querySelector('[data-pause]').onclick = function(){
        effect.pause();
    };
}