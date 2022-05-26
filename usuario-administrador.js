
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs,onSnapshot } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js';
//https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
    apiKey: "AIzaSyCzBQ9q4K8PzCOlPTqLBxra6I2V7HXuop8",
    authDomain: "fir-mercaexpress.firebaseapp.com",
    projectId: "fir-mercaexpress",
    storageBucket: "fir-mercaexpress.appspot.com",
    messagingSenderId: "801456117910",
    appId: "1:801456117910:web:b88b8d9d4677852f070ab7"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();


window.onload = function () {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const uid = user.uid;
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if(docSnap.data().role == 1){
                const nom = docSnap.data().nombre;
                const ap = docSnap.data().apellido;
                const urlImg = docSnap.data().imgPerfil;
                const img = document.getElementById('foto-Supervisor');
                const em = document.getElementById('name');
                img.setAttribute('src', urlImg);
                em.innerHTML = "<span>" + nom + " " + ap + "</span>";
            }else{
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Acceso denegado ¡Vuelva a iniciar sesión!',
                    color: '#312d2d',
                    background: '#ffffff',
                    confirmButtonColor: '#ffcc00',
                    timer: 3000
                }).then(async (result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                      await logout("e")
                    } else{
                        window.location = "login.html"
                    }
                })
                window.location = "login.html" 
            }
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Inicie sesión Primero!',
                color: '#312d2d',
                background: '#ffffff',
                confirmButtonColor: '#ffcc00'
            })
            
            window.location = "login.html"
        }
    });
};

const form = document.getElementById('form-registro');

form.addEventListener('submit', e => registrarVendedor(e));

async function registrarVendedor(e) {
    e.preventDefault();
    bloquearContenido();
    if (contraseñaValida()) {
        const rol = asignarRol();
        const img = await subirImagen('perfil');
        const email = document.getElementById('e-mail').value;
        const password = document.getElementById('password').value;
        const nom = document.getElementById('nombre').value;
        const ap = document.getElementById('apellido').value;
        const tel = document.getElementById('telefono').value;
        const dir = document.getElementById('dirección').value;

        var exito = await registrarUsuario(auth, email, password, rol, img, nom, ap, tel, dir);

    } else {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '¡Las contraseñas no son las mismas!',
            color: '#312d2d',
            background: '#ffffff',
            confirmButtonColor: '#ffcc00',
            timer: 2000,
            toast: true
            
        })
        desbloquearContenido();
        form.reset();
    }
}

async function registrarUsuario(auth, email, password, rol, img, nom, ap, tel, dir) {
    const citiesRef = await collection(db, "users");
    const q = query(citiesRef, where("email", "==", email));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {

        const docData = {
            email: email,
            contraseña: password,
            nombre: nom,
            apellido: ap,
            telefono: tel,
            direccion: dir,
            role: rol,
            imgPerfil: img
        };
        await setDoc(doc(db, "users", email), docData);

        await Swal.fire({
            icon: 'success',
            title: 'Correcto',
            text: '¡Usuario Registrado!',
            color: '#312d2d',
            background: '#ffffff',
            confirmButtonColor: '#ffcc00',
            timer: 2000,
            toast: true
        })
        desbloquearContenido();
        form.reset();
    } else {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '¡El Correo Electronico ya existe!',
            color: '#312d2d',
            background: '#ffffff',
            confirmButtonColor: '#ffcc00',
            timer: 2000,
            toast: true
        })
        desbloquearContenido();
        document.getElementById('e-mail').value = "";
    }
}

async function subirImagen(tag) {
    var file = document.getElementById(tag).files[0];
    if (file === undefined) {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '¡Ingrese una foto!',
            color: '#312d2d',
            background: '#ffffff',
            confirmButtonColor: '#ffcc00',
            timer: 2000,
            toast: true
        })
        desbloquearContenido();
    }else{
        const storage = getStorage();
        const storageRef = ref(storage, 'images/' + file.name);

        // 'file' comes from the Blob or File API
        await uploadBytes(storageRef, file).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });

        let img;
        await getDownloadURL(ref(storage, 'images/' + file.name)).then((url) => {
            img = url;
        });
        return img;
    }

}




function asignarRol() {
    var combo = document.getElementById("elegirRol");
    var selected = combo.options[combo.selectedIndex].text;
    console.log(selected)
    if (selected == "Supervisor") {
        return 2;
    } else if (selected == "Vendedor") {
        return 3;
    }

    return -1;
}

function contraseñaValida() {
    return (document.getElementById('confirmar_contraseña').value) == (document.getElementById('password').value)
}
const btnLogout = document.getElementById('logout');
if (btnLogout != null) {
    btnLogout.addEventListener('click', e => logout(e));
}

async function logout(e) {    
    await signOut(auth);
    window.location = "login.html" 
}

const btnImg = document.getElementById('redirect');
if (btnImg != null) {
    btnImg.addEventListener('click', () => {window.location = "index.html" });
}

const formEmpresa = document.getElementById('Empresa');

formEmpresa.addEventListener('submit', e => registrarEmpresa(e));

async function registrarEmpresa(e) {
    e.preventDefault()
    bloquearContenido();
    const empresaColeccion = await collection(db, "empresa");
    const nom = document.getElementById('nombreEmpresa').value;
    const nomR = document.getElementById('responsable_empresa').value;
    const dire = document.getElementById('dirección_Empresa').value;
    const telf = document.getElementById('telefono_empresa_cliente').value;
    const res = query(empresaColeccion, where("nombre", "==", nom));
    const cod = nom.charAt(0).toUpperCase() + "-" + telf.substring(0,3)
    const querySnapshot = await getDocs(res);
    if (querySnapshot.empty) {

        const docData = {
            nombre: nom,
            direccion: dire,
            nombreResponsable : nomR,
            telefono : telf
        };
        
        await setDoc(doc(db, "empresa", cod), docData);
        await Swal.fire({
            icon: 'success',
            title: 'Correcto',
            text: '¡Empresa Registrada!',
            color: '#312d2d',
            background: '#ffffff',
            confirmButtonColor: '#ffcc00',
            timer: 2000,
            toast: true
        })
        desbloquearContenido();
        formEmpresa.reset();

    } else {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '¡Esta Empresa Ya Existe!',
            color: '#312d2d',
            background: '#ffffff',
            confirmButtonColor: '#ffcc00',
            timer: 2000,
            toast: true
        })
        desbloquearContenido();
        nom.value = "";
    }
    actualizar(comboBoxC)
    actualizarLista(listaC);
}

const comboBoxC = document.getElementById('seleccion');

comboBoxC.onchange = actualizar(comboBoxC)

async function actualizar(combo) {
    combo.innerHTML = '';
    const coleccion = await collection(db, "empresa");
    const querySnapshote = await getDocs(coleccion);
    var arreglosNombre = [];
    await querySnapshote.forEach((doc) => {
        arreglosNombre.push( doc.data().nombre);
    });
    arreglosNombre.sort();
    arreglosNombre.forEach(function(numero) {
        var opt = document.createElement('option');
        opt.value = numero;
        opt.innerHTML = numero;
        combo.appendChild(opt);
    });
    


    console.log(combo);
};
const formPV = document.getElementById('puntoventa');

formPV.addEventListener('submit', e => registrarPV(e));

async function registrarPV(e) {
    e.preventDefault()
    await bloquearContenido();
    const up = await collection(db, "Puntoventa");
    const img = await fotoPV();
    const nom = document.getElementById('nombreVenta').value;
    const tel = document.getElementById('telefonoVenta').value;
    const dire = document.getElementById('direcciónVenta').value;
    const res = document.getElementById('responsable').value;
    const mail = document.getElementById('e-mailVenta').value;
    const cod = nom.charAt(0).toUpperCase() +"-"+ tel.substring(0,3);
    const comparar = query(up, where("Mail", "==", mail))
    const querySnapshot = await getDocs(comparar);
    const comp = await collection(db, "users");
    const q = query(comp, where("email", "==", res));
    const consulta = await getDocs(q);
    if (consulta.empty) {

        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '¡El Responsanble No existe!',
            color: '#312d2d',
            background: '#ffffff',
            confirmButtonColor: '#ffcc00',
            timer: 2000,
            toast: true
        })
        desbloquearContenido();
        document.getElementById('responsable').value = "";
    } else {

        if (querySnapshot.empty) {

            const docData = {
                Mail: mail,
                Nombre: nom,
                Direccion: dire,
                Responsable: res,
                Telefono: tel,
                Imagen: img

            };
            await setDoc(doc(db, "Puntoventa", cod), docData);
            //asociarlo el punto de venta
            // pe
            await Swal.fire({
                icon: 'success',
                title: 'Correcto',
                text: '¡Punto De Venta Registrado!',
                color: '#312d2d',
                background: '#ffffff',
                confirmButtonColor: '#ffcc00',
                timer: 2000,
                toast: true
            })
            desbloquearContenido();
            formPV.reset();
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: '¡Este Punto De Venta Ya Esta Registrado!',
                color: '#312d2d',
                background: '#ffffff',
                confirmButtonColor: '#ffcc00',
                timer: 2000,
                toast: true
            })
            desbloquearContenido();
            const mail = document.getElementById('e-mailVenta').value = "";

        }
    }

}
async function fotoPV() {
    var file = document.getElementById('foto_producto').files[0];
    if (file === undefined) {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '¡Ingrese una foto!',
            color: '#312d2d',
            background: '#ffffff',
            confirmButtonColor: '#ffcc00',
            timer: 2000,
            toast: true
        })
        desbloquearContenido();
    }else{
        const storage = getStorage();
        const storageRef = ref(storage, 'images/' + file.name);

        // 'file' comes from the Blob or File API
        await uploadBytes(storageRef, file).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });

        let img;
        await getDownloadURL(ref(storage, 'images/' + file.name)).then((url) => {
            img = url;
        });
        return img;
    }

    

}

const formSele = document.getElementById('ingresar');
formSele.addEventListener('click', e => avanzar(e));

let codigoEmpresa = "";

async function avanzar(e) {
    e.preventDefault();
    document.getElementById('nombre_empresa').value = document.getElementById('seleccion').value;
    const q = await query(collection(db, "empresa"), where("nombre", "==", document.getElementById('nombre_empresa').value));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        codigoEmpresa = doc.id;
    });

}

const formProducto = document.getElementById('formulario_registro');
formProducto.addEventListener('submit', e => añadirProducto(e));

async function añadirProducto(e) {
    e.preventDefault();
    bloquearContenido();
    const imgProducto = await subirImagen('fotos_del_producto');
    const nomProducto = document.getElementById('nombre_producto').value;
    console.log(nomProducto)
    const precioProducto = document.getElementById('precio').value;
    const codProducto = document.getElementById('codigo_producto').value;
    const exi = 0;
    const docu = await doc(db, "empresa", codigoEmpresa, 'catalogo', codProducto);
    const obSnap = await getDoc(docu);
    if (!obSnap.exists()) {
        const docData = {
            nombre: nomProducto,
            precio: precioProducto,
            existencia: exi,
            foto: imgProducto
        };
        const refeCatalogoEmpresa = doc(db, "empresa", codigoEmpresa, 'catalogo', codProducto);
        await setDoc(refeCatalogoEmpresa, docData);
        await Swal.fire({
            icon: 'success',
            title: 'Correcto',
            text: '¡Producto Registrado!',
            color: '#312d2d',
            background: '#ffffff',
            confirmButtonColor: '#ffcc00',
            timer: 2000,
            toast: true
        })
        desbloquearContenido();
        formProducto.reset();
    } else {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '¡Producto ya Esta Registrado!',
            color: '#312d2d',
            background: '#ffffff',
            confirmButtonColor: '#ffcc00',
            timer: 2000,
            toast: true
        })
        document.getElementById('codigo_producto').value = "";
        desbloquearContenido();
    }
}

const listaC = document.getElementById('catalogos_disponibles');

listaC.onchange = actualizarLista(listaC);

async function actualizarLista(combo) {
    combo.innerHTML = '';
    const coleccion = await collection(db, "empresa");
    const querySnapshote = await getDocs(coleccion);
    await querySnapshote.forEach((doc) => {
        var divN = document.createElement('div')
        divN.setAttribute('class', 'nombre_empresa')
        var opt = document.createElement('input');
        opt.value = doc.data().nombre;
        opt.type = "button"
        opt.setAttribute('class', "nombre_cliente_empresa")
        divN.appendChild(opt);
        combo.appendChild(divN);
    });

    $(function () {
        $(".nombre_cliente_empresa").click(async function () {

            const q = await query(collection(db, "empresa"), where("nombre", "==", this.value));
            var codSele = "";
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                codSele = doc.id;
            });

            await cargarPortada(codSele);

            await cargarProductos(codSele);

            $("#contenedor_para_registrar_catalogo").hide();
            $("#contenedor_ingresar_catalogo").hide();
            $("#contenedor_visualizar_catalogo").show();

        });
    });

    console.log(combo);
};

async function cargarProductos(cod) {
    var contenedor = document.getElementById("lista_producto");
    contenedor.innerHTML = "";
    const coleccion = await collection(db, "empresa", cod, "catalogo");
    const querySnapshote = await getDocs(coleccion);
    console.log(querySnapshote.empty)
    let nro = 1;
    await querySnapshote.forEach((doc) => {
        const nid = "nombre_producto"+nro;
        const rutaimg = doc.data().foto;
        const nom = doc.data().nombre;
        console.log(nom)
        contenedor.innerHTML +=
            '<div class="producto_item">' +
                '<img src =' + rutaimg + ' alt = "" >' +
                '<a href="#" class="datos_producto">' +
                    '<label for="nombre_producto1">Nombre:</label>' +
                    '<input type="text" name="nombre_producto1" id='+nid+' value="" readonly class="input_texto_producto"><br>' +
                    '<label for="codigo_producto1">Cod. Prod:</label>' +
                    '<input type="text" name="codigo_producto1" id="codigo_producto1" value=' + doc.id + ' readonly class="input_texto_producto"><br>' +
                    '<label for="precio_producto">Precio:</label>' +
                    '<input type="text" name="precio_producto" id="precio_producto" value=' + doc.data().precio + ' readonly class="input_texto_producto"><br>' +
                '</a>' +
            '</div>';
        document.getElementById(nid).setAttribute("value", nom);
        nro += 1;
    });
}

async function cargarPortada(cod) {
    const docu = await doc(db, "empresa", cod);
    console.log(docu)
    const obSnap = await getDoc(docu);
    if (obSnap.exists()) {
        document.getElementById("nombre_de_la_empresa").value = obSnap.data().nombre;
        document.getElementById("nombre_del_responsable").value = obSnap.data().nombreResponsable;
        document.getElementById("codigo_empresa").value = obSnap.id;
        document.getElementById("direccion_empresa").value = obSnap.data().direccion;
        document.getElementById("telefono_empresa").value = obSnap.data().telefono;
    }
}

async function bloquearContenido(){
    await $.blockUI({message : null});
}
function desbloquearContenido(){
    $.unblockUI();
}


let codem = "";
let nomEm = "";
async function avanzarARegistro() {
    console.log("Hola")
    var refEmp= "";
    var datosEmp = "";
    if(document.getElementById('codigo__campo-registrar-pedido').value !== ""){
        refEmp = await doc(db, "empresa", document.getElementById('codigo__campo-registrar-pedido').value)
        datosEmp = await getDoc(refEmp);
        if(datosEmp.exists()){
            nomEm = datosEmp.data().nombre;
            codem = datosEmp.id;
        }
    }
    
    
}

$(function(){
    $(".ingresar__registrar-pedido").click(async function(){
        await avanzarARegistro();
        if(codem !== ""|| codem === undefined){
            $("#opciones__empresa").hide();
            $(".inventario__empresa").hide();
            $("#contenedor__añadir-empresa").hide();
            $(".formulario__ingresar-pedido-cliente").hide();
            $(".registrar__pedido").show();
            $(".nombre__cliente").hide();
            $(".telefono__cliente").hide();
            $(".direccion__cliente").hide();
            $(".añadir__nuevo-pedido").hide();
            $(".botom__ingresar-pedido-cliente").show();
            document.getElementById('nombre__empresa').innerHTML = nomEm;
            document.getElementById('codigo__campo-registrar-pedido').value = "";
        }else{
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: '¡Empresa no existente!',
                color: '#312d2d',
                background: '#ffffff',
                confirmButtonColor: '#ffcc00',
                timer: 2000,
                toast: true
            })
        }
    });
});

let codPV = "";
async function procederARegistro() {
    console.log("Hola")
    if(document.getElementById('ingresar__codigo-datos-cliente').value !== ""){
        const refPV = await doc(db, "Puntoventa", document.getElementById('ingresar__codigo-datos-cliente').value)
        const datosPV = await getDoc(refPV);
        if(datosPV.exists()){
            codPV = datosPV.id;
        }
    }
}

$(function(){
    $(".botom__ingresar-pedido-cliente").click(async function(){
        await bloquearContenido();
        await procederARegistro();
        if(codPV !== ""){
            await cargarInformacionCliente(codPV)
            $("#opciones__empresa").hide();
            $(".inventario__empresa").hide();
            $("#contenedor__añadir-empresa").hide();
            $(".registrar__pedido").show();
            $(".formulario__ingresar-pedido-cliente").show();
            $(".nombre__cliente").show();
            $(".telefono__cliente").show();
            $(".direccion__cliente").show();
            $(".añadir__nuevo-pedido").show();
            $(".botom__ingresar-pedido-cliente").hide();
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const uid = user.uid;
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    const nom = docSnap.data().nombre;
                    const ap = docSnap.data().apellido;
                    document.getElementById("dUsuario").innerHTML = nom +" "+ ap
                }
            })
            desbloquearContenido();
        }else{
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: '¡El punto de venta no existe!',
                color: '#312d2d',
                background: '#ffffff',
                confirmButtonColor: '#ffcc00',
                timer: 2000,
                toast: true
            })
            desbloquearContenido();
            document.getElementById('ingresar__codigo-datos-cliente').value = "";
        }
        
    });
});

async function cargarInformacionCliente(c){
    const docu = await doc(db, "Puntoventa", c);
    console.log(docu)
    const obSnap = await getDoc(docu);
    if (obSnap.exists()) {
        document.getElementById("nomPV").innerHTML = obSnap.data().Nombre;
        document.getElementById("dirPV").innerHTML = obSnap.data().Direccion;
        document.getElementById("telPV").innerHTML = obSnap.data().Telefono;
        document.getElementById('ingresar__codigo-datos-cliente').disabled = true;
    }
}

$(function(){
    $(".volver__inventario").click(async function(){
        var res = $('.botom__ingresar-pedido-cliente').is(':hidden');
        console.log(res);
        if(res){
            bloquearContenido();
            await Swal.fire({
                position : 'center',
                title: 'Se perderá todo el progreso, ¿Está seguro?',
                color: '#312d2d',
                background: '#ffffff',
                confirmButtonColor: '#ffcc00',
                showCancelButton: true,
                confirmButtonText: 'Si, salir',
                toast : false
            }).then(async (result) => {
                if (result.isConfirmed) {
                    codem = "";
                    codPV = ""
                    lol="";
                    lolNomEmp = "";
                    document.getElementById("nomPV").innerHTML = "";
                    document.getElementById("dirPV").innerHTML = "";
                    document.getElementById('ingresar__codigo-datos-cliente').value = "";
                    document.getElementById('ingresar__codigo-datos-cliente').disabled = false;
                    document.getElementById("telPV").innerHTML = "";
                    limpiarCampos();
                    document.getElementById("ingresar_codigo").value = "";
                    $(".reporte__pedidos-ingresados").remove();
                    codsPedido = [];
                    $(".inventario__empresa").hide();
                    $(".registrar__pedido").hide();
                    $("#contenedor__añadir-empresa").hide();
                    $("#opciones__empresa").show();
                } else{
                }
                desbloquearContenido();
            })
        }else{
            codem = "";
            codPV = ""
            lol="";
            lolNomEmp = "";
            document.getElementById("nomPV").innerHTML = "";
            document.getElementById("dirPV").innerHTML = "";
            document.getElementById('ingresar__codigo-datos-cliente').value = "";
            document.getElementById('ingresar__codigo-datos-cliente').disabled = false;
            document.getElementById("telPV").innerHTML = "";
            limpiarCampos();
            document.getElementById("ingresar_codigo").value = "";
            $(".reporte__pedidos-ingresados").remove();
            codsPedido = [];
            $(".inventario__empresa").hide();
            $(".registrar__pedido").hide();
            $("#contenedor__añadir-empresa").hide();
            $("#opciones__empresa").show();
        }
        
        
        
    });
});

const inpCod = document.getElementById("ingresar_codigo");
inpCod.addEventListener('keyup', e => verificarCodigo(e))
var originalState = $(".contenedor__input-ingresar-pedido").clone();

async function verificarCodigo(e){
    console.log("Te escucho");
    e.preventDefault();
    const valor = document.getElementById("ingresar_codigo").value;
    const docRef = doc(db, "empresa", codem, "catalogo", valor );
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        document.getElementById("descP").textContent  = docSnap.data().nombre;
        document.getElementById("exP").textContent  = docSnap.data().existencia;
        document.getElementById('preP').textContent  = docSnap.data().precio;
        if (docSnap.data().existencia=== 0 ){
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: '¡El producto no esta disponible!',
                color: '#312d2d',
                background: '#ffffff',
                confirmButtonColor: '#ffcc00',
                timer: 2000,
                toast: true
            })
            limpiarCampos();
            document.getElementById("ingresar_codigo").value = "";
        }else{
            document.getElementById("ingresar__cantidad_producto").disabled = false;
            document.getElementById("ingresar__cantidad_producto").setAttribute('max', docSnap.data().existencia)
            precioPA = docSnap.data().precio
        }
    }else{
        document.getElementById("descP").textContent  = "";
        document.getElementById("exP").textContent  = "";
        document.getElementById('preP').textContent  = "";
        document.getElementById('preTP').textContent = "";
        document.getElementById('ingresar__cantidad_producto').value = "";
        document.getElementById('ingresar__cantidad_producto').disabled = true;
    }
}
var precioPA= "";
const inpCan = document.getElementById("ingresar__cantidad_producto");
inpCan.addEventListener('change', e => verificarCantidad(e))
inpCan.addEventListener('keyup', e => verificarCantidad(e))
async function verificarCantidad(e){
    e.preventDefault();
    const regex = /^[0-9]*$/;
    console.log(document.getElementById('ingresar__cantidad_producto').value)
    if(Number(document.getElementById('ingresar__cantidad_producto').value) > document.getElementById('ingresar__cantidad_producto').max){
        document.getElementById('ingresar__cantidad_producto').value = "";
    }
    document.getElementById('preTP').textContent  = inpCan.value * precioPA;
}

const btnAg = document.getElementById("btnAgregar");
btnAg.addEventListener('click', e => agregarAlPedido(e));
const divContendor = document.getElementById("formulario__ingresar-pedido-cliente");
var codsPedido = [];
async function agregarAlPedido(e){
    e.preventDefault();
    bloquearContenido();
    if(document.getElementById("ingresar_codigo").value == ""){
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '¡Ingrese un porducto!',
            color: '#312d2d',
            background: '#ffffff',
            confirmButtonColor: '#ffcc00',
            timer: 2000,
            toast: true
        })
        desbloquearContenido();
    }else{
        const valor = document.getElementById("ingresar_codigo").value;
        const docRef = doc(db, "empresa", codem, "catalogo", valor );
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && codsPedido.indexOf(docSnap.id) == -1) {
            if(document.getElementById('ingresar__cantidad_producto').value == 0 ||document.getElementById('ingresar__cantidad_producto').value == ""){
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: '¡Ingrese una cantidad!',
                    color: '#312d2d',
                    background: '#ffffff',
                    confirmButtonColor: '#ffcc00',
                    timer: 2000,
                    toast: true
                })
                desbloquearContenido();
            }else{
                await agregarUnaCelda(docSnap.data().nombre, docSnap.data().precio, docSnap.id);
                codsPedido.push(docSnap.id)
                limpiarCampos();
                document.getElementById("ingresar_codigo").value = "";
            }
            desbloquearContenido();

        }else{
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: '¡Producto no valido!',
                color: '#312d2d',
                background: '#ffffff',
                confirmButtonColor: '#ffcc00',
                timer: 2000,
                toast: true
            })
            desbloquearContenido();
        }
    }
}

async function limpiarCampos(){
    document.getElementById("ingresar_codigo").textContent  = "";
    document.getElementById("descP").textContent  = "";
    document.getElementById("exP").textContent  = "";
    document.getElementById('preP').textContent  = "";
    document.getElementById('preTP').textContent  = "";
    document.getElementById('ingresar__cantidad_producto').value = "";
    document.getElementById('ingresar__cantidad_producto').disabled = true;
}

async function agregarUnaCelda(nombre, precio, id){    
    var divContenedor =  document.createElement("div");                                      
    divContenedor.setAttribute('class', 'reporte__pedidos-ingresados');
    var ids = 'reporte__pedidos-ingresados' + (codsPedido.length +1 ); 
    divContenedor.setAttribute('id', ids);
    var divNombre  = document.createElement("div"); 
    divNombre.setAttribute('class', 'descripcion__pedido-ingresado');
    var spanNombre = document.createElement("span");
    spanNombre.setAttribute('class',"descripcion__producto-igresado tamaño__value") 
    spanNombre.textContent = nombre;

    divNombre.appendChild(spanNombre);

    var divCantidad = document.createElement("div");
    divCantidad.setAttribute('class',"cantidad__pedido-ingresado");
    var spanCantidad = document.createElement("span"); 
    spanCantidad.setAttribute('class', "cantidad__producto-ingresado tamaño__value")
    spanCantidad.textContent = document.getElementById('ingresar__cantidad_producto').value;

    divCantidad.appendChild(spanCantidad);
    
    var divPrecio = document.createElement("div");
    divPrecio.setAttribute('class',"precio__pedido-ingresado")
    var spanPrecio = document.createElement("span"); 
    spanPrecio.setAttribute('class', "precio__producto-ingresado tamaño__value")
    spanPrecio.textContent = precio;

    divPrecio.appendChild(spanPrecio);

    var divPrecioTotal = document.createElement("div");
    divPrecioTotal.setAttribute('class',"precio__total-pedido-ingresado")
    var spanPrecioTotal = document.createElement("span"); 
    spanPrecioTotal.setAttribute('class', "precio__total-producto-ingresado tamaño__value" )
    spanPrecioTotal.textContent = document.getElementById('preTP').textContent;

    divPrecioTotal.appendChild(spanPrecioTotal);

    var divEliminar = document.createElement("div");
    divEliminar.setAttribute('class',"accion__pedido-ingresado")
    var btnEliminar = document.createElement("span");
    btnEliminar.setAttribute('class', "accion__realizar-sobre-pedido-ingresado")
    var ibtn = document.createElement('i');
    ibtn.setAttribute('class','fa-solid fa-trash-can')
    var spbtn = document.createElement('span');
    spbtn.setAttribute('class','eliminar')
    spbtn.textContent += " Eliminar";
    btnEliminar.addEventListener('click', function(){
        var idjq = '#'+ids;
        $(idjq).remove();
        codsPedido.pop(id)
    })
    btnEliminar.appendChild(ibtn);
    btnEliminar.appendChild(spbtn);
    divEliminar.appendChild(btnEliminar);

    divContenedor.appendChild(divNombre);
    divContenedor.appendChild(divCantidad);
    divContenedor.appendChild(divPrecio);
    divContenedor.appendChild(divPrecioTotal);
    divContenedor.appendChild(divEliminar);

    document.getElementById('formulario__ingresar-pedido-cliente').appendChild(divContenedor)
}
var pedidoHecho = false;
$('.añadir__nuevo-pedido').click(async function(){
    bloquearContenido();
    if(pedidoHecho === true){
        pedidoHecho = false;
        codPV = ""
        document.getElementById("nomPV").innerHTML = "";
        document.getElementById("dirPV").innerHTML = "";
        document.getElementById('ingresar__codigo-datos-cliente').value = "";
        document.getElementById('ingresar__codigo-datos-cliente').disabled = false;
        $(".botom__ingresar-pedido-cliente").show();
        document.getElementById("telPV").innerHTML = "";
        limpiarCampos();
        document.getElementById("ingresar_codigo").value = "";
        $(".reporte__pedidos-ingresados").remove();
        codsPedido = [];
        $(".formulario__ingresar-pedido-cliente").hide();
        $(".nombre__cliente").hide();
        $(".telefono__cliente").hide();
        $(".direccion__cliente").hide();
        $(".añadir__nuevo-pedido").hide();
        $(".contenedor__calcular-precio-pedido").remove();
        desbloquearContenido();
    }else if($('.botom__ingresar-pedido-cliente').is(':hidden') || codsPedido.length > 0 ){
        await Swal.fire({
            position : 'top-end',
            title: 'Se perderá todo el progreso, ¿Está seguro?',
            color: '#312d2d',
            background: '#ffffff',
            confirmButtonColor: '#ffcc00',
            showCancelButton: true,
            confirmButtonText: 'Si, nuevo pedido',
            toast : true
        }).then(async (result) => {
            if (result.isConfirmed) {
                codPV = ""
                document.getElementById("nomPV").innerHTML = "";
                document.getElementById("dirPV").innerHTML = "";
                document.getElementById('ingresar__codigo-datos-cliente').value = "";
                document.getElementById('ingresar__codigo-datos-cliente').disabled = false;
                $(".botom__ingresar-pedido-cliente").show();
                document.getElementById("telPV").innerHTML = "";
                limpiarCampos();
                document.getElementById("ingresar_codigo").value = "";
                $(".reporte__pedidos-ingresados").remove();
                codsPedido = [];
                $(".formulario__ingresar-pedido-cliente").hide();
                $(".nombre__cliente").hide();
                $(".telefono__cliente").hide();
                $(".direccion__cliente").hide();
                $(".añadir__nuevo-pedido").hide();
                desbloquearContenido();
            }else{

            }
        })
        
    }
    desbloquearContenido();
});

$('.anular').click(async function(){
    if(codsPedido.length > 0){
        await Swal.fire({
            position : 'top-end',
            title: 'Se perderá todo el progreso, ¿Está seguro?',
            color: '#312d2d',
            background: '#ffffff',
            confirmButtonColor: '#ffcc00',
            showCancelButton: true,
            confirmButtonText: 'Si, salir',
            toast : true
        }).then(async (result) => {
            if (result.isConfirmed) {
                bloquearContenido();
                await limpiarCampos()
                document.getElementById("ingresar_codigo").value = "";
                codsPedido = [];
                $(".reporte__pedidos-ingresados").remove();
                desbloquearContenido();
            }
        })
        
    }
    
});

$('.procesar').click(async function(){
    bloquearContenido();
    var refUsuario = "";
    var refEmpresa = "";
    var refPuntoVenta = "";
    let nroPedido = 0;
    await onAuthStateChanged(auth, async (user) => {
        await Swal.fire({
            position : 'top-end',
            title: 'Desea procesar el pedido?',
            color: '#312d2d',
            background: '#ffffff',
            confirmButtonColor: '#ffcc00',
            showCancelButton: true,
            confirmButtonText: 'Si, procesar',
            cancelButtonText: 'Cancelar',
            toast : true
        }).then(async (result) => {
            if (result.isConfirmed) {
                if(codsPedido.length >= 1 ){
                    console.log("aasda")
                    refUsuario =  await doc(db, 'empleado', user.uid);
                    refEmpresa = await doc(db, 'empesa', codem);
                    refPuntoVenta = await doc(db, 'Puntoventa', codPV);
                    const querySnapshot = await getDocs(collection(db, "pedidos"));
                    var nrodoc = 0;
                    querySnapshot.forEach((doc) => {
                        nrodoc = nrodoc + 1;
                    });
                    nroPedido = nrodoc;
                    const docData = {
                        realizadoPor : refUsuario,
                        para : refEmpresa,
                        proviniente : refPuntoVenta,
                        totalCosto : 0,
                        iva : 0,
                        costoPedido : 0
                    }
                    console.log(nroPedido);
                    nroPedido = nroPedido + 1;
                    const refPedido = await doc(db, "pedidos", ""+nroPedido);
                    await setDoc(refPedido, docData);
                    await listarPedido((""+nroPedido), codem);
                    await sacarCostosFinales((""+nroPedido));
                    await mostrarCostosFinales((""+nroPedido));
                    await Swal.fire({
                        icon: 'success',
                        title: 'Correcto',
                        text: 'Pedido Registrado!',
                        color: '#312d2d',
                        background: '#ffffff',
                        confirmButtonColor: '#ffcc00',
                        timer: 2000,
                        toast: true
                    })

                    pedidoHecho = true;
                    $('.añadir__nuevo-pedido').trigger('click');
                    desbloquearContenido();
                }else{
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: '¡Debe ingresar 1 o mas productos al Pedido!',
                        color: '#312d2d',
                        background: '#ffffff',
                        confirmButtonColor: '#ffcc00',
                        timer: 2000,
                        toast: true
                    })
                    desbloquearContenido();
                }
            } else{
                desbloquearContenido();
            }
        })
        
    })
    
    
});

async function sacarCostosFinales(idPedido){
    let sumPedido = 0;
    const q = collection(db, "pedidos", idPedido, 'lista');
    const unsubscribe = await onSnapshot(q, async(querySnapshot) => {
        var sum = 0;
        querySnapshot.forEach((doc) => {
            sum = sum + doc.data().precioTotal;
            console.log(sum);
        });
        var ivaP = sum * 0.13;
        var totalCostoP = sum + ivaP;
        const docData = {
            totalCosto : totalCostoP,
            iva : ivaP,
            costoPedido : sum
        }
        const refPedido = await doc(db, "pedidos", idPedido);
        await setDoc(refPedido, docData, {merge : true});
    });
    

}

async function mostrarCostosFinales(idPedido){
    const unsub =await onSnapshot(doc(db, "pedidos", idPedido), (doc) => {
        var divCostosContenedor  = document.createElement("div"); 
        divCostosContenedor.setAttribute('class', 'contenedor__calcular-precio-pedido');

        var divTotPar  = document.createElement("div"); 
        divTotPar.setAttribute('class', 'total__parcial');
        var labelTotPar = document.createElement("label");
        labelTotPar.setAttribute('class',"general general__texto") 
        labelTotPar.setAttribute('for',"")
        labelTotPar.textContent = "Total Parcial:";

        divTotPar.appendChild(labelTotPar);

        var divTotParN  = document.createElement("div"); 
        divTotParN.setAttribute('class', 'total__parcial-numeral');
        var spanTotPAr = document.createElement("span");
        spanTotPAr.setAttribute('class',"general") 
        spanTotPAr.textContent = doc.data().costoPedido;

        divTotParN.appendChild(spanTotPAr);

        var divIva  = document.createElement("div"); 
        divIva.setAttribute('class', 'texto__iva');
        var labelIva = document.createElement("label");
        labelIva.setAttribute('class',"general general__texto") 
        labelIva.setAttribute('for',"")
        labelIva.textContent = "Iva(13%):";

        divIva.appendChild(labelIva);

        var divIvaN  = document.createElement("div"); 
        divIvaN.setAttribute('class', 'numeral__iva');
        var spanIva = document.createElement("span");
        spanIva.setAttribute('class',"general") 
        spanIva.textContent = doc.data().iva;
        
        divIvaN.appendChild(spanIva);

        var divTot  = document.createElement("div"); 
        divTot.setAttribute('class', 'texto__total');
        var labelTot = document.createElement("label");
        labelTot.setAttribute('class',"general general__texto") 
        labelTot.setAttribute('for',"")
        labelTot.textContent = "Total:";

        divTot.appendChild(labelTot);

        var divTotN  = document.createElement("div"); 
        divTotN.setAttribute('class', 'numeral__total');
        var spanTotPAr = document.createElement("span");
        spanTotPAr.setAttribute('class',"general") 
        spanTotPAr.textContent = doc.data().totalCosto;

        divTotN.appendChild(spanTotPAr);

        divCostosContenedor.appendChild(divTotPar);
        divCostosContenedor.appendChild(divTotParN);
        divCostosContenedor.appendChild(divIva);
        divCostosContenedor.appendChild(divIvaN);
        divCostosContenedor.appendChild(divTot);
        divCostosContenedor.appendChild(divTotN);

        $(".contenedor__calcular-precio-pedido").remove();
        document.getElementById('formulario__ingresar-pedido-cliente').appendChild(divCostosContenedor);
    });

    
}
async function listarPedido(idPedido,codem){
    let nro = 0;
    codsPedido.forEach(async (cd)=>{
        nro = nro+1;
        var divCref = '#'+'reporte__pedidos-ingresados'+ nro;
        await agregarProductoALista(nro, divCref, idPedido,codem, cd);
    })
}

async function agregarProductoALista(nro, divCref,idPedido,codem, cd){
    const  refProducto = await doc(db, 'empresa', codem, 'catalogo', cd)
    const docSnap = await getDoc(refProducto);
    var nuevaExistencia = docSnap.data().existencia - (Number(document.querySelector(divCref).getElementsByClassName('cantidad__producto-ingresado tamaño__value')[0].textContent));
    await setDoc(refProducto, { existencia: nuevaExistencia }, { merge: true });

    const docData = {
        producto: await doc(db, 'empresa', codem, 'catalogo', cd),
        cantidad: document.querySelector(divCref).getElementsByClassName('cantidad__producto-ingresado tamaño__value')[0].textContent,
        precioTotal : Number(document.querySelector(divCref).getElementsByClassName('precio__total-producto-ingresado tamaño__value')[0].textContent)
    };
    
    const refeListaPedido = await doc(db, "pedidos", idPedido, 'lista', ""+ nro);
    await setDoc(refeListaPedido, docData);
}
let lol="";
let lolNomEmp = "";
async function compC(){
    var refEmpr="";
    var datosEmpr="";
    console.log("Hola")
    if(document.getElementById('codigo__campo-actualizar-inventario').value !== ""){
        refEmpr = await doc(db, "empresa", document.getElementById('codigo__campo-actualizar-inventario').value);
        datosEmpr = await getDoc(refEmpr)
    if(datosEmpr.exists()){
        lol = datosEmpr.id;
        lolNomEmp = datosEmpr.data().nombre
    }
}
}
$(function(){
    $(".ingresar__actualizar-inventario").click(async function(){
       await compC ();
       
       if(lol !== "" || lol === undefined){
        await cargarinvetario (lol);
        $("#opciones__empresa").hide();
        $("#contenedor__añadir-empresa").hide();
        $(".registrar__pedido").hide();
        $("#inventario_oo").show();
        document.getElementById('inventarioo').innerHTML = lolNomEmp;
        document.getElementById('codigo__campo-actualizar-inventario').value = "";
        
    }else{
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '¡Esta Empresa no existe!',
            color: '#312d2d',
            background: '#ffffff',
            confirmButtonColor: '#ffcc00',
            timer: 1000,
            toast: true
        })
                 }
    });
});
async function cargarinvetario(od) {
    var contenedor = document.getElementById("columna__inventario-cabeceraa");
    contenedor.innerHTML = "";
    const coleccion = await collection(db, "empresa", od, "catalogo");
    const querySnapshote = await getDocs(coleccion);
    console.log(querySnapshote.empty)
    
    var cont=1;
    
    await querySnapshote.forEach((doc) => {
        const nid = "nombre_producto"+cont;
        const nad = "existencia"+cont ;
        const ned ="botoniv"+cont;
        const nod= "codd"+cont;
        const exi =doc.data().existencia;
        const nom = doc.data().nombre;
        console.log(nom)
        contenedor.innerHTML +=
                        
                        '<div class="cuerpo__inventario">'+
                             '<span class="codigo__producto-inventario" id='+nod+' value='+doc.id+'readonly>'+doc.id+'</span> '+
                        '</div> '+
                        '<div class="cuerpo__inventario">'+
                             '<span class="nombre__producto-inventario"  id="hola" value="" readonly>'+nom+'</span> '+
                        '</div>'+
                        ' <div class="cuerpo__inventario">'+
                            '<span class="existencia__producto-inventario" id='+nid+' readonly >'+exi+'</span>'+
                        ' </div>'+
                        '<div class="cuerpo__inventario">'+
                        '   <input type="number" class='+nad+' id ='+nad+' pattern="[0-9]"value=""  min="1" max="100000" maxlength="6" oninput="if(this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"onkeypress="return (event.charCode >= 48 && event.charCode <= 57)"></input>'+
                        '</div>';
                       // '<button class="button__actualizar-inventario" id='+ned+' ><i class="fa-solid fa-rotate"></i> Actualizar</button>';
            
        document.getElementById(nid).setAttribute("value", nom);
        cont += 1;
        
        
    });
}


$(function(){
    $(".button__actualizar-inventario").click(async function(){
        for (var i=1;i<=10;i++){
            if (document.getElementById('existencia'+i).value==''){

            }
            else{
        const codp = document.getElementById('codd'+i).textContent;
        const exis= Number(document.getElementById('existencia'+i).value);
        console.log(codp)
        console.log(lol)
        const docu = await doc(db, "empresa", lol, "catalogo", codp);
        await setDoc(docu,{
            
                existencia: exis
            },{merge:true});
            
        document.getElementById('nombre_producto'+i).innerHTML = document.getElementById('existencia'+i).value;
        document.getElementById('existencia'+i).value='';
            }
        }
    });
})

