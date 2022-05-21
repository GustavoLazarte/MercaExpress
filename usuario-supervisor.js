
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
            if(docSnap.data().role == 2){
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
    }

    try {
        const storage = getStorage();
        const storageRef = ref(storage, 'images/' + file.name);
    } catch (error) {
        desbloquearContenido();
    }

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
    const nom = document.getElementById('nombreEmpresa').value.trim();
    const nomR = document.getElementById('responsable_empresa').value.trim();
    const dire = document.getElementById('dirección_Empresa').value.trim();
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
        nom.value = "";
        desbloquearContenido();
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
    await querySnapshote.forEach((doc) => {
        var opt = document.createElement('option');
        opt.value = doc.data().nombre;
        opt.innerHTML = doc.data().nombre;
        combo.appendChild(opt);
    });


    console.log(combo);
};
const formPV = document.getElementById('puntoventa');

formPV.addEventListener('submit', e => registrarPV(e));

async function registrarPV(e) {
    e.preventDefault()
    bloquearContenido();
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
            document.getElementById('e-mailVenta').value = "";

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
    }

    try {
        const storage = getStorage();
        const storageRef = ref(storage, 'images/' + file.name);
    } catch (error) {
        desbloquearContenido();
    }

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
function bloquearContenido(){
    $.blockUI({message : null});
}
function desbloquearContenido(){
    $.unblockUI();
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
let codP="";

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

}