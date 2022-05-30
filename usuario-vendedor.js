import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs , onSnapshot} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
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

var cerramosCesion = false;

window.onload = async function () {
    const auth = getAuth();
    await onAuthStateChanged(auth, async (user) => {
        
        if (user) {
            const uid = user.uid;
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if(docSnap.data().role == 3){
                const nom = docSnap.data().nombre;
                const ap = docSnap.data().apellido;
                const urlImg = docSnap.data().imgPerfil;
                const img = document.getElementById('foto-Supervisor');
                const em = document.getElementById('name');
                img.setAttribute('src', urlImg);
                em.innerHTML = "<span>" + nom + " " + ap + "</span>";
                document.getElementsByTagName('h1')[0].innerHTML = "!Bienvenido "+nom+" "+ap+ "!";
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
            if(!cerramosCesion){
                console.log(cerramosCesion)
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
        }
    });
};
const btnLogout = document.getElementById('logout');
if (btnLogout != null) {
    btnLogout.addEventListener('click', async e => await logout(e));
}

async function logout(e) {  
    cerramosCesion = true;  
    await signOut(auth);
    window.location = "login.html" 
}

const btnImg = document.getElementById('redirect');
if (btnImg != null) {
    btnImg.addEventListener('click', () => {window.location = "index.html" });
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
            await Swal.fire({
                position : 'center',
                title: 'Se perderá todo el progreso, ¿Está seguro?',
                color: '#312d2d',
                background: '#ffffff',
                confirmButtonColor: '#ffcc00',
                showCancelButton: true,
                confirmButtonText: 'Sí, salir',
                cancelButtonText: 'No, cancelar',
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
const inpCantidad =  document.getElementById("ingresar__cantidad_producto");
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
        }else{
            document.getElementById("ingresar__cantidad_producto").disabled = false;
            document.getElementById("ingresar__cantidad_producto").setAttribute('max', docSnap.data().existencia)
            inpCantidad.addEventListener('input', validarEntrante);
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
            position : 'center',
            title: 'Se perderá todo el progreso, ¿Está seguro?',
            color: '#312d2d',
            background: '#ffffff',
            confirmButtonColor: '#ffcc00',
            showCancelButton: true,
            confirmButtonText: 'Si, nuevo pedido',
            cancelButtonText: 'No, cancelar',
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
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'No, cancelar',
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
            title: '¿Desea procesar el pedido?',
            color: '#312d2d',
            background: '#ffffff',
            confirmButtonColor: '#ffcc00',
            showCancelButton: true,
            confirmButtonText: 'Sí, procesar',
            cancelButtonText: 'Cancelar',
            toast : true
        }).then(async (result) => {
            if (result.isConfirmed) {
                if(codsPedido.length >= 1 ){
                    var nroPedido = await generarNumero();
                    console.log(nroPedido)
                    var crear = await crearPedido((""+nroPedido),user);
                    var listar =await listarPedido((""+nroPedido), codem);
                    var sacarCostso = await sacarCostosFinales((""+nroPedido));
                    
                    var alerta = await mostrarAlertas((""+nroPedido));
                    
                        
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

async function mostrarAlertas(idPedido){
    await Swal.fire({
        icon: 'success',
        title: 'Correcto',
        text: 'Pedido Registrado!',
        color: '#312d2d',
        background: '#ffffff',
        confirmButtonColor: '#ffcc00',
        toast: true
    })
    pedidoHecho = true;
    await $('.añadir__nuevo-pedido').trigger('click');
    desbloquearContenido();
}
async function crearPedido(idPedido, user){
    
    var refUsuario =  await doc(db, 'empleado', user.uid);
    var refEmpresa = await doc(db, 'empesa', codem);
    var refPuntoVenta = await doc(db, 'Puntoventa', codPV);
    
    
    const docData = {
        realizadoPor : refUsuario,
        para : refEmpresa,
        proviniente : refPuntoVenta,
        totalCosto : 0,
        iva : 0,
        costoPedido : 0
    }
    const refPedido = await doc(db, "pedidos", idPedido);
    await setDoc(refPedido, docData);
    console.log("2");
}

async function generarNumero(){
    const querySnapshot = await getDocs(collection(db, "pedidos"));
    console.log(querySnapshot)
    var nroPedido = 0;
    var nrodoc = 0;
    querySnapshot.forEach((doc) => {
        nrodoc = nrodoc + 1;
    });
    nroPedido = nrodoc;
    console.log("1");
    return nroPedido +1;
}
async function sacarCostosFinales(idPedido){
    let sumPedido = 0;
    const q = await collection(db, "pedidos", idPedido, 'lista');
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

    const unsub = onSnapshot (doc(db, "pedidos", idPedido), async (doc) => {
        await mostrarCostosFinales(doc.data().costoPedido,doc.data().iva,doc.data().totalCosto); 
        if(document.getElementsByClassName('contenedor__calcular-precio-pedido').length > 1){
            const element = document.getElementsByClassName('contenedor__calcular-precio-pedido')[0];
            element.remove();   
        }
        
    });
    
}

async function mostrarCostosFinales(cpd,iv,cpdt){
    console.log("entre")
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
    spanTotPAr.textContent = cpd;

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
    spanIva.textContent = iv;
    
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
    spanTotPAr.textContent = cpdt;

    divTotN.appendChild(spanTotPAr);

    divCostosContenedor.appendChild(divTotPar);
    divCostosContenedor.appendChild(divTotParN);
    divCostosContenedor.appendChild(divIva);
    divCostosContenedor.appendChild(divIvaN);
    divCostosContenedor.appendChild(divTot);
    divCostosContenedor.appendChild(divTotN);

    document.getElementById('formulario__ingresar-pedido-cliente').appendChild(divCostosContenedor);

    
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
function validarEntrante(){
    console.log(this.id)
    if(Number(this.value) <= this.max){
        console.log("Hola")
        if(this.value.charAt(0) == '0' && this.value.length > 1){
            console.log("Entre al if")
            this.value = "";
        }
    }else{
        this.value = "";
    }
}