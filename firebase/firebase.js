import { initializeApp } from "firebase/app";
import "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "./config";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

class Firebase {
  constructor() {
    initializeApp(firebaseConfig);
    this.auth = getAuth();
    this.db = getFirestore();
    this.storage = getStorage();
  }

  //*RegistraUsuario
  async registrar(nombre, email, password) {
    const nuevoUsuario = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    return await updateProfile(nuevoUsuario.user, {
      displayName: nombre,
    });
  }

  //*Inicia Sesión
  async login(email, password) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  //*Cierra sesión
  async cerrarSesion() {
    await signOut(this.auth);
  }
}
const firebase = new Firebase();
export default firebase;
