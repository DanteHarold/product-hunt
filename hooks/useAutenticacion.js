import React, { useEffect, useState } from "react";
import firebase from "@/firebase";

export default function useAutenticacion() {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);

  useEffect(() => {
    const unsuscribe = firebase.auth.onAuthStateChanged((usuario) => {
      if (usuario) {
        setUsuarioAutenticado(usuario);
      } else {
        setUsuarioAutenticado(null);
      }
    });
    return () => unsuscribe();
  }, []);

  return usuarioAutenticado;
}