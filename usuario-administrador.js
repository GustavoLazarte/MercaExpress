
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
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
            await setDoc(doc(db, "Puntoventa", mail), docData);
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
    const nomProducto = document.getElementById('nombre_producto').value.repl;
    console.log(nomProducto)
    const precioProducto = document.getElementById('precio').value;
    const codProducto = document.getElementById('codigo_producto').value;

    const docu = await doc(db, "empresa", codigoEmpresa, 'catalogo', codProducto);
    const obSnap = await getDoc(docu);
    if (!obSnap.exists()) {
        const docData = {
            nombre: nomProducto,
            precio: precioProducto,
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

async function avanzarARegistro() {
    console.log("Hola")
    const q = await query(collection(db, "empresa"), where("nombre", "==", document.getElementById('codigo__campo-registrar-pedido').value));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        codem = doc.id;
    });
}

$(function(){
    $(".ingresar__registrar-pedido").click(async function(){
        await avanzarARegistro();
        if(codem !== ""){
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
            document.getElementById('nombre__empresa').innerHTML = document.getElementById('codigo__campo-registrar-pedido').value;
            document.getElementById('codigo__campo-registrar-pedido').value = "";
        }else{
            alert("No existe esa empresa")
        }
    });
});

let codPV = "";
async function procederARegistro() {
    console.log("HolaPV")
    const q = await query(collection(db, "Puntoventa"), where("Nombre", "==", document.getElementById('ingresar__codigo-datos-cliente').value));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        codPV= doc.id;
    });
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
            desbloquearContenido();
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
    }
}

$(function(){
    $(".volver__inventario").click(async function(){
        var res = $('.botom__ingresar-pedido-cliente').is(':hidden');
        console.log(res);
        if(res){
            await Swal.fire({
                position : 'top-end',
                title: 'Se perdera todo el progreso, esta seguro?',
                color: '#312d2d',
                background: '#ffffff',
                confirmButtonColor: '#ffcc00',
                showCancelButton: true,
                confirmButtonText: 'Si, salir',
                toast : true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    codem = "";
                    codPV = ""
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
            })
        }else{
            codem = "";
            codPV = ""
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
        if (parseInt(docSnap.data().existencia , 10) === 0 ){
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
        document.getElementById('preTP').intextContent = "";
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
    if(document.getElementById('ingresar__cantidad_producto').value > document.getElementById('ingresar__cantidad_producto').max){
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
        alert("Ingrese un producto")
        desbloquearContenido;
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
$('.anular').click(async function(){
    bloquearContenido();
    await limpiarCampos()
    document.getElementById("ingresar_codigo").value = "";
    codsPedido = [];
    $(".reporte__pedidos-ingresados").remove();
    desbloquearContenido();
});

$('.anular').click(async function(){
    bloquearContenido();
    await limpiarCampos()
    document.getElementById("ingresar_codigo").value = "";
    codsPedido = [];
    $(".reporte__pedidos-ingresados").remove();
    desbloquearContenido();
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
            confirmButtonText: 'Save',
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
                    const refPedido = doc(db, "pedidos", ""+nroPedido);
                    await setDoc(refPedido, docData);
                    await listarPedido((""+nroPedido), codem);
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
async function listarPedido(idPedido,codem){
    let nro = 0;
    codsPedido.forEach(async (cd)=>{
        nro = nro+1;
        var divCref = '#'+'reporte__pedidos-ingresados'+ nro;
        await agregarProductoALista(nro, divCref, idPedido,codem, cd);
    })
}

async function agregarProductoALista(nro, divCref,idPedido,codem, cd){
    const docData = {
        producto: await doc(db, 'empresa', codem, 'catalogo', cd),
        cantidad: document.querySelector(divCref).getElementsByClassName('cantidad__producto-ingresado tamaño__value')[0].textContent,
        precioTotal : document.querySelector(divCref).getElementsByClassName('precio__total-producto-ingresado tamaño__value')[0].textContent
    };
    
    const refeListaPedido = await doc(db, "pedidos", idPedido, 'lista', ""+ nro);
    await setDoc(refeListaPedido, docData);
}
let lol="";
async function compC(){
    console.log("Hola")
    const codE = document.getElementById('codigo__campo-actualizar-inventario').value;

    const q = await query(collection(db, "empresa"), where("nombre", "==", codE));

    const querySnapshot = await getDocs(q);  
    querySnapshot.forEach((doc) => {
        lol = doc.id;
    });
}
$(function(){
    $(".ingresar__actualizar-inventario").click(async function(){
       await compC ();
       
       if(lol !== ""){
        await cargarinvetario (lol);
        $("#opciones__empresa").hide();
        $("#contenedor__añadir-empresa").hide();
        $(".registrar__pedido").hide();
        $("#inventario_oo").show();
        document.getElementById('inventarioo').innerHTML = document.getElementById('codigo__campo-actualizar-inventario').value;
        document.getElementById('codigo__campo-actualizar-inventario').value = "";
        
    }else{
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '¡Esta Empresa no existe!',
            color: '#312d2d',
            background: '#ffffff',
            confirmButtonColor: '#ffcc00',
            timer: 2000,
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
    let nro = 1;
    await querySnapshote.forEach((doc) => {
        const nid = "nombre_producto"+nro;
        const exi =doc.data().existencia;
        const nom = doc.data().nombre;
        console.log(nom)
        contenedor.innerHTML +=
                        
                        '<div class="cuerpo__inventario">'+
                             '<span class="codigo__producto-inventario" id="codep" value='+doc.id+'readonly>'+doc.id+'</span> '+
                        '</div> '+
                        '<div class="cuerpo__inventario">'+
                             '<span class="nombre__producto-inventario"  id='+nid+' value="" readonly>'+nom+'</span> '+
                        '</div>'+
                        ' <div class="cuerpo__inventario">'+
                            '<span class="existencia__producto-inventario" readonly >'+exi+'</span>'+
                        ' </div>'+
                        '<div class="cuerpo__inventario">'+
                        '   <input type="number" id ="nueva_existencia" value="" ></input>'+
                        
                        '</div>';
                        //'<button class="button__actualizar-inventario"><i class="fa-solid fa-rotate"></i> Actualizar</button>';
            
        document.getElementById(nid).setAttribute("value", nom);
        nro += 1;
    });
}
/*let codP="";

async function coP(){
    console.log("Holabastardo")
    const codE = document.getElementById('codep').value;

    const q = await query(collection(db, "catalo"), where("codProducto", "==", codE));

    const querySnapshot = await getDocs(q);  
    querySnapshot.forEach((doc) => {
        codP = doc.id;
    });
}
$(function(){
    $(".button__actualizar-inventario").click(async function(){
     await actualizarexis(codP);
    });
});

    async function actualizarexis(lel){
        await coP();
        const exis=document.getElementById('nueva_existencia').value;
        const col = await collection(db, "empresa",lel, "catalogo");
        const querySnapshote = await getDocs(col);
        console.log(querySnapshote.empty)
        col.update({
        existencia :exis
        });
        const refeCatalogoEmpresa = doc(db, "empresa", 'catalogo');
        await setDoc(refeCatalogoEmpresa, docData);

}*/