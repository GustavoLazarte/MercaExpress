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


//function subirFoto(){
//    if
//}


