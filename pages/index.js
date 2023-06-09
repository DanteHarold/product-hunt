import Layout from "@/components/layout/Layout";
import { collection, getDocs } from "firebase/firestore";
import { FirebaseContext } from "@/firebase";
import styled from "@emotion/styled";
import { useContext, useEffect, useState } from "react";
import { DetalleProducto } from "@/components/layout/DetalleProducto";
import useProductos from "@/hooks/useProductos";

const Home = () => {
  const { productos } = useProductos("creado");
  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <div className="bg-white">
              {productos.map((producto) => (
                <DetalleProducto key={producto.id} producto={producto} />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
