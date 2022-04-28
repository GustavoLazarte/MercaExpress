//'use strict'
//
//const li = document.querySelectorAll('.hola')
//const bloque = document.querySelectorAll('.bloque')
//
//li.forEach( function(cadaLi, i){
//    li[i].addEventListener('click',function(){
//        
//        li.forEach( function(cadaLi, i){
//            li[i].classList.remove('activa');
//            //bloque[i].classList.remove('activo');
//        });
//
//        //li[i].classList.add('activo');
//        //bloque[i].classList.add('activo');
//    
//    });
//});
$("#contenedor_para_registrar_catalogo").hide();
$(function(){
    $("#ingresar").click(function(event){
        $("#contenedor_ingresar_catalogo").hide();
        $("#contenedor_para_registrar_catalogo").show();
        event.preventDefault();
    });
});

$(function(){
    $("#volver").click(function(){
        $("#contenedor_para_registrar_catalogo").hide();
        $("#contenedor_ingresar_catalogo").show();
    });
});

$(function(){
    $(".nombre_cliente_empresa").click(function(){
        $("#contenedor_para_registrar_catalogo").hide();
        $("#contenedor_ingresar_catalogo").hide();
    });
});