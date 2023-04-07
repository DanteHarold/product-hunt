import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import formatDistanceNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { FirebaseContext } from "@/firebase";
import { collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import Layout from "@/components/layout/Layout";
import Error404 from "@/components/layout/404";

import { Campo, InputSubmit } from "@/components/ui/Formulario";
import Boton from "@/components/ui/Boton";

const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Producto = () => {
  const [producto, setProducto] = useState({});
  const [error, setError] = useState(false);
  const [comentario, setComentario] = useState({});

  const router = useRouter();
  const {
    query: { id },
  } = router;

  //*Context de Firebase
  const { firebase, usuario } = useContext(FirebaseContext);

  useEffect(() => {
    if (id) {
      const obtenerProducto = async () => {
        const productoQuery = await doc(
          collection(firebase.db, "productos"),
          id
        );
        const productoID = await getDoc(productoQuery);
        if (productoID.data()) {
          setProducto(productoID.data());
        } else {
          console.log("no existe");
          setError(true);
        }
      };
      obtenerProducto();
    }
  }, [id]);

  if (Object.keys(producto).length === 0 && !error) return "Cargando";

  const {
    // id,
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    votos,
    imagen,
    creador,
    haVotado,
  } = producto;

  const votarProducto = () => {
    if (!usuario) {
      return router.push("/login");
    }
    //*Obtener y sumar nuvo voto
    const nuevoTotal = votos + 1;

    if (haVotado.includes(usuario.uid)) return;

    const nuevoHaVotado = [...haVotado, usuario.uid];

    const productRef = doc(firebase.db, "productos", id);
    //* Actualizar la BD
    setDoc(
      productRef,
      { votos: nuevoTotal, haVotado: nuevoHaVotado },
      { merge: true }
    );
    //* Actualizar el State
    setProducto({
      ...producto,
      votos: nuevoTotal,
      haVotado: nuevoHaVotado,
    });
  };

  //* Crear Comentarios
  const comentarioChange = (e) => {
    setComentario({
      ...comentario,
      [e.target.name]: e.target.value,
    });
  };

  //* Identifica si el comentario es el creado del producto

  const esCreador = (id) => {
    if (creador.id == id) {
      return true;
    }
  };

  const agregarComentario = (e) => {
    e.preventDefault();

    if (!usuario) {
      return router.push("/login");
    }

    //*Información extra al comentario
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;

    //*Copia comentario y agregar al Arreglo
    const nuevosComentarios = [...comentarios, comentario];

    //* Actualizar la BD
    const productRef = doc(firebase.db, "productos", id);
    setDoc(productRef, { comentarios: nuevosComentarios }, { merge: true });

    //*Actualizar State
    setProducto({
      ...producto,
      comentarios: nuevosComentarios,
    });
  };

  //* Función que revisa que el creador del producto sea el mismo que está autenticado
  const puedeEliminar = () => {
    if (!usuario) return false;

    if (creador?.id === usuario.uid) {
      return true;
    }
  };

  const eliminarProducto = async () => {
    if (!usuario) {
      return router.push("/login");
    }
    if (creador?.id !== usuario.uid) {
      return router.push("/");
    }
    try {
      // Eliminar Producto
      await deleteDoc(doc(firebase.db, "productos", id));
      router.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Layout>
      {error ? (
        <Error404 />
      ) : (
        <div className="contenedor">
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            {nombre}
          </h1>
          <ContenedorProducto>
            <div>
              <p>
                Publicado Hace :{" "}
                {formatDistanceNow(new Date(creado), { locale: es })}
              </p>
              <p>
                Por : {creador?.nombre} de {empresa}{" "}
              </p>
              <img src={imagen} alt="" />
              <p>{descripcion}</p>

              {usuario && (
                <div>
                  <h2>Agrega tu Comentario</h2>
                  <form onSubmit={agregarComentario}>
                    <Campo>
                      <input
                        type="text"
                        name="mensaje"
                        onChange={comentarioChange}
                      />
                    </Campo>
                    <InputSubmit type="submit" value={"Agregar Comentario"} />
                  </form>
                </div>
              )}

              <h2
                css={css`
                  margin-top: 2rem;
                `}
              >
                Comentarios
              </h2>

              {comentarios.length === 0 ? (
                "Aun No hay Comentarios"
              ) : (
                <ul>
                  {comentarios.map((comentario, index) => (
                    <li
                      key={`${comentario.usuarioId}-${index}`}
                      css={css`
                        border: 1px solid #e1e1e1;
                        padding: 2rem;
                      `}
                    >
                      <p>{comentario.mensaje}</p>
                      <p>
                        Escrito por :{" "}
                        <span
                          css={css`
                            font-weight: bold;
                          `}
                        >
                          {comentario.usuarioNombre}
                        </span>
                      </p>
                      {esCreador(comentario.usuarioId) && (
                        <CreadorProducto>Por el Creador</CreadorProducto>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <aside>
              <Boton target="_blank" bgColor="true" href={url}>
                Visitar URL
              </Boton>

              <div
                css={css`
                  margin-top: 5rem;
                `}
              >
                <p
                  css={css`
                    text-align: Center;
                  `}
                >
                  {votos} Votos
                </p>

                {usuario && <Boton onClick={votarProducto}>Votar</Boton>}
              </div>
            </aside>
          </ContenedorProducto>
          {puedeEliminar() && (
            <Boton onClick={eliminarProducto}>Eliminar Producto</Boton>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Producto;
