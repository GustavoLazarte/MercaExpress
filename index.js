

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

window.onloadstart = await controlDeSesion();

async function controlDeSesion () {
    const auth = getAuth();
    await onAuthStateChanged(auth, async (user) => {
        if (user) {
            document.getElementById('btnIV').innerHTML = "Volver"
            const uid = user.uid;
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            const rol = docSnap.data().role;
            if (rol == 1) {
                document.getElementById('btnIV').setAttribute("href","usuario-administrador.html");
            } else if (rol == 2) {
                document.getElementById('btnIV').setAttribute("href","usuario-supervisor.html");
            } else if (rol == 3) {
                document.getElementById('btnIV').setAttribute("href","usuario-vendedor.html");
            }    
        }else{
            document.getElementById('btnIV').innerHTML ='Iniciar Sesión'
            document.getElementById('btnIV').setAttribute("href","login.html");
        }
    });
}
const NavToggle =document.querySelector(".toggle")
const NavMenu=document.querySelector(".nav-menu")

NavToggle.addEventListener("click",() =>{
    NavMenu.classList.toggle("nav-menu_visible")

}); 

