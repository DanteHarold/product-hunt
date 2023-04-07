import Layout from "@/components/layout/Layout";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { DetalleProducto } from "@/components/layout/DetalleProducto";
import useProductos from "@/hooks/useProductos";
import { useEffect, useState } from "react";

const Buscar = () => {
  const router = useRouter();
  const {
    query: { q },
  } = router;

  const { productos } = useProductos("creado");
  const [resultado, setResultado] = useState([]);

  useEffect(() => {
    const busqueda = q?.toLowerCase();
    const filtro = productos.filter((producto) => {
      return (
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.descripcion.toLowerCase().includes(busqueda)
      );
    });
    setResultado(filtro);
  }, [q, productos]);

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <div className="bg-white">
              {resultado.map((producto) => (
                <DetalleProducto key={producto.id} producto={producto} />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Buscar;
