import { FirebaseContext } from "@/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useState, useEffect, useContext } from "react";

const useProductos = (orden) => {
  const [productos, setProductos] = useState([]);

  const { firebase } = useContext(FirebaseContext);

  useEffect(() => {
    const obtenerProductos = async () => {
      const querySnapshot = await getDocs(
        query(collection(firebase.db, "productos"), orderBy(orden, "desc"))
      );
      const productos = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setProductos(productos);
    };
    obtenerProductos();
  }, []);

  return {
    productos,
  };
};
export default useProductos;
