let archivo = document.querySelector('#perfil');
archivo.addEventListener('change', () => {
    document.querySelector('#nombres').innerHTML = archivo.files[0].name;
});

let archivos = document.querySelector('#fotos_del_producto');
archivos.addEventListener('change', () => {
    document.querySelector('#nombress').innerHTML = archivos.files[0].name;
});

let archivoss = document.querySelector('#foto_producto');
archivoss.addEventListener('change', () => {
    document.querySelector('#nombresss').innerHTML = archivoss.files[0].name;
});

let formAP = document.getElementById("formulario_registro")
formAP.addEventListener('reset', () =>{
    document.querySelector('#nombress').innerHTML = "";
});

let formAU = document.getElementById("form-registro")
formAU.addEventListener('reset', () =>{
    document.querySelector('#nombres').innerHTML = "";
});

let formAPV = document.getElementById("puntoventa")
formAPV.addEventListener('reset', () =>{
    document.querySelector('#nombresss').innerHTML = "";
});
//function subirFoto(){
//    if
//}


