
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { getStorage, ref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js';
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
            em.innerHTML = "<pre>" + nom + " " + ap + "</pre>";

        } else {

            // User is signed out
            // ...
        }
    });
};

const form = document.getElementById('form-registro');

form.addEventListener('submit', e => registrarVendedor(e));

function registrarVendedor(e) {
    e.preventDefault();
    if (contraseñaValida()) {
        const rol = 3;
        const img = subirImagen();
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {

                const docData = {
                    email: document.getElementById('e-mail').value,
                    nombre: document.getElementById('nombre').value,
                    apellido: document.getElementById('apellido').value,
                    telefono: document.getElementById('telefono').value,
                    direccion: document.getElementById('dirección').value,
                    role: rol,
                    imgPerfil: img
                };
                await setDoc(doc(db, "users", userCredential.user.uid), docData);
                // Signed in
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });
    } else {

    }
}

function subirImagen() {
    const file = document.getElementById('perfil').files[0];
    const mountainsRef = ref(storage, file.name);
    let img;
    let refer = "images/"+file.name;
    
    const mountainImagesRef = ref(storage, refer);
    
    const obtenerFoto = getDownloadURL(ref(storage, refer))
        .then((url) => {
            img = url;
        });

    return img;
}

function contraseñaValida(){
    return (document.getElementById('confirmar_contraseña').value) == (document.getElementById('password').value)
}