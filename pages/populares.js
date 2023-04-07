import Layout from "@/components/layout/Layout";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { FirebaseContext } from "@/firebase";
import styled from "@emotion/styled";
import { DetalleProducto } from "@/components/layout/DetalleProducto";
import useProductos from "@/hooks/useProductos";

const Populares = () => {
  const { productos } = useProductos("votos");

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

export default Populares;
