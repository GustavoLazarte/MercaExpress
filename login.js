
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getFirestore, deleteDoc, doc, getDoc, setDoc, query, collection, getDocs, where } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
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
const form = document.querySelector("#login-form");

window.open = await controlDeSesionAbierta();

async function controlDeSesionAbierta () {
    const auth = getAuth();
    await onAuthStateChanged(auth, async (user) => {
        if (user) {
            const uid = user.uid;
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            const rol = docSnap.data().role;
            if (rol == 1) {
                window.location = "usuario-administrador.html";
            } else if (rol == 2) {
                window.location = "usuario-supervisor.html";
            } else if (rol == 3) {
                window.location = "usuario-vendedor.html";
            }    
        }
    });
}
if (form != null) {
    form.addEventListener('submit', e => login(e));
}


async function login(e) {
    e.preventDefault()
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    const obRef = await doc(db, "users", email);
    const obSnap = await getDoc(obRef);
    if (!obSnap.exists()) {
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                const rol = docSnap.data().role;
                console.log(rol);
                if (rol == 1) {
                    window.location = "usuario-administrador.html";
                } else if (rol == 2) {
                    window.location = "usuario-supervisor.html";
                } else if (rol == 3) {
                    window.location = "usuario-vendedor.html";
                }

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Contraseña o Usuario incorrectos!',
                    color: '#312d2d',
                    background: '#ffffff',
                    confirmButtonColor: '#ffcc00',
                    timer : 2000,
                    toast: true
                })
                form.reset();
            });

    } else {
        if (obSnap.data().contraseña == password) {
            await iniciarSesionPrimeraVes(email, password, obSnap);
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Contraseña o Usuario incorrectos!',
                color: '#312d2d',
                background: '#ffffff',
                confirmButtonColor: '#ffcc00',
                timer : 2000,
                toast: true
            })
        }
    }

}

async function iniciarSesionPrimeraVes(email, password, obSnap) {
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {

            await setDoc(doc(db, "users", userCredential.user.uid), obSnap.data());
            await deleteDoc(doc(db, "users", email));

            const docRef = await doc(db, "users", userCredential.user.uid);
            const docSnap = await getDoc(docRef);

            const rol = docSnap.data().role;
            console.log(rol);
            if (rol == 1) {
                window.location = "usuario-administrador.html";
            } else if (rol == 2) {
                window.location = "usuario-supervisor.html";
            } else if (rol == 3) {
                window.location = "usuario-vendedor.html";
            }

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
        });
}