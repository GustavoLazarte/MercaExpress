
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
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
            const nom = docSnap.data().nombre;
            const ap = docSnap.data().apellido;
            const urlImg = docSnap.data().imgPerfil;
            const img = document.getElementById('foto-Supervisor');
            const em = document.getElementById('name');
            img.setAttribute('src', urlImg);
            em.innerHTML = "<span>" + nom + " " + ap + "</span>";

        } else {
            alert("Inicie Sesion primero!");
            window.location = "login.html"
        }
    });
};

const form = document.getElementById('form-registro');

form.addEventListener('submit', e => registrarVendedor(e));

async function registrarVendedor(e) {
    e.preventDefault();
    if (contraseñaValida()) {
        const rol = asignarRol();
        const img = await subirImagen();
        const email = document.getElementById('e-mail').value;
        const password = document.getElementById('password').value;
        const nom = document.getElementById('nombre').value;
        const ap = document.getElementById('apellido').value;
        const tel = document.getElementById('telefono').value;
        const dir = document.getElementById('dirección').value;

        var exito = await registrarUsuario(auth, email, password, rol, img, nom, ap, tel, dir);

    } else {
        alert("Error de contraseñas");
        form.reset();
    }
}

async function registrarUsuario(auth, email, password, rol, img, nom, ap, tel, dir) {
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {

            const docData = {
                email: email,
                nombre: nom,
                apellido: ap,
                telefono: tel,
                direccion: dir,
                role: rol,
                imgPerfil: img
            };
            await setDoc(doc(db, "users", userCredential.user.uid), docData);
            // Signed in
            const user = userCredential.user;
            // ...
            alert("Usuario registrado con exito!");
            form.reset();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
            document.getElementById('e-mail').value = "";
        });
}

async function subirImagen() {
    const file = document.getElementById('perfil').files[0];

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

function logout(e) {
    console.log("Hola")
    signOut(auth);
}

const btnImg = document.getElementById('redirect');
if (btnImg != null) {
    btnImg.addEventListener('click', e => logout(e));
}