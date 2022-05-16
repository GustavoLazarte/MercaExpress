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
$("#contenedor_visualizar_catalogo").hide();
$(function(){
    $("#ingresar").click(function(event){
        $("#contenedor_ingresar_catalogo").hide();
        $("#contenedor_visualizar_catalogo").hide();
        $("#contenedor_para_registrar_catalogo").show();
        event.preventDefault();
    });
});

$(function(){
    $(".volver").click(function(){
        $("#contenedor_para_registrar_catalogo").hide();
        $("#contenedor_visualizar_catalogo").hide();
        $("#contenedor_ingresar_catalogo").show();
    });
});

$(function(){
    $(".nombre_cliente_empresa").click(function(){
        $("#contenedor_para_registrar_catalogo").hide();
        $("#contenedor_ingresar_catalogo").hide();
        $("#contenedor_visualizar_catalogo").show();
    });
});

$(function(){
    $(".volvers").click(function(){
        $("#contenedor_visualizar_catalogo").hide();
        $("#contenedor_para_registrar_catalogo").hide();
        $("#contenedor_ingresar_catalogo").show();
    });
});

//Empresa

$("#contenedor__añadir-empresa").hide();
$(".inventario__empresa").hide();
$(".registrar__pedido").hide();

$(function(){
    $(".ingresar__añadir-punto-venta").click(function(){
        $("#opciones__empresa").hide();
        $(".registrar__pedido").hide();
        $(".inventario__empresa").hide();
        $("#contenedor__añadir-empresa").show();
    });
});

$(function(){
    $("#volver__opciones-empresa").click(function(){
        $("#contenedor__añadir-empresa").hide();
        $(".registrar__pedido").hide();
        $(".inventario__empresa").hide();
        $("#opciones__empresa").show();
    });
});

$(function(){
    $(".ingresar__actualizar-inventario").click(function(){
        $("#opciones__empresa").hide();
        $("#contenedor__añadir-empresa").hide();
        $(".registrar__pedido").hide();
        $(".inventario__empresa").show();
    });
});

$(function(){
    $(".volver__inventario").click(function(){
        $(".inventario__empresa").hide();
        $(".registrar__pedido").hide();
        $("#contenedor__añadir-empresa").hide();
        $("#opciones__empresa").show();
    });
});
$(function(){
    $(".ingresar__registrar-pedido").click(function(){
        $("#opciones__empresa").hide();
        $(".inventario__empresa").hide();
        $("#contenedor__añadir-empresa").hide();
        $(".registrar__pedido").show();
        $(".formulario__ingresar-pedido-cliente").hide();
    });
});

$(function(){
    $(".botom__ingresar-pedido-cliente").click(function(){
        $("#opciones__empresa").hide();
        $(".inventario__empresa").hide();
        $("#contenedor__añadir-empresa").hide();
        $(".registrar__pedido").show();
        $(".formulario__ingresar-pedido-cliente").show();
    });
});