
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
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
const btnLogout = document.getElementById('logout')


if (form != null) {
    form.addEventListener('submit', e => login(e));
}


function login(e) {
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            const rol = docSnap.data().role;
            console.log(rol);
            if (rol == 1) {                
                window.location = "usuario-administrador.html";
            }else if(rol == 2){                
                window.location = "usuario-supervisor.html";                
            }else if(rol == 3){
                window.location = "usuario-vendedor.html";
            }

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
            alert("Contraseña o Usuario incorrectos!");
            form.reset();
        });
    e.preventDefault()
}
if (btnLogout != null) {
    btnLogout.addEventListener('click', e => logout(e));
}


function logout(e) {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            const uid = user.uid;
            console.log(uid);
            // ...
        } else {
            
            // User is signed out
            // ...
        }
    });
    signOut(auth)
        .then(() => {
            window.location = "login.html";

        }).catch((error) => {
            // An error happened.
        });
    
}


/**e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const rol = 1;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const docData = {
                email: email,
                role : rol
            };
            setDoc(doc(db,"users",userCredential.user.uid),docData);
            // Signed in
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        }); */