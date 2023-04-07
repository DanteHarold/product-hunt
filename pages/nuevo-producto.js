import Layout from "@/components/layout/Layout";
import { css } from "@emotion/react";
import { useRouter } from "next/router";
// import FileUploader from "react-firebase-file-uploader";
import React, { useContext, useState } from "react";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "@/components/ui/Formulario";

import { FirebaseContext } from "../firebase";

import useValidacion from "@/hooks/useValidacion";
import validarCrearProducto from "@/validacion/validarCrearProducto";
import { collection, addDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "@firebase/storage";
import { fileUpload } from "@/helpers/fileUpload";
import Error404 from "@/components/layout/404";

const STATE_INICIAL = {
  nombre: "",
  empresa: "",
  imagen: "",
  url: "",
  descripcion: "",
};

const NuevoProducto = () => {
  const [error, setError] = useState(false);

  const {
    errores,
    valores,
    setValores,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa, imagen, url, descripcion } = valores;

  //**Hook de raouting redireccionar */
  const router = useRouter();

  //*Context operaciones Crud Firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  async function crearProducto() {
    if (!usuario) {
      return router.push("/login");
    }
    //*Crear Objeto de Nuevo Producto
    const producto = {
      nombre,
      empresa,
      imagen,
      url,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName,
      },
      haVotado: [],
    };

    //*Insertarlo en la BD
    try {
      await addDoc(collection(firebase.db, "productos"), producto);
    } catch (error) {
      console.error(error);
    }

    router.push("/");
    setValores({
      nombre: "",
      empresa: "",
      imagen: "",
      url: "",
      descripcion: "",
    });
  }

  const handleImageUpload = async ({ target }) => {
    if (target.files === 0) return;
    console.log("Subiendo Archivos");
    console.log(target.files);
    // await fileUpload(target.files[0]);
    const fileUploadPromises = [];

    for (const file of target.files) {
      fileUploadPromises.push(fileUpload(file));
    }
    const photosUrl = await Promise.all(fileUploadPromises);
    setValores({
      ...valores,
      imagen: photosUrl[0],
    });
  };

  return (
    <div>
      <Layout>
        {!usuario ? (
          <Error404 />
        ) : (
          <>
            <h1
              css={css`
                text-align: center;
                margin-bottom: 5rem;
              `}
            >
              Nuevo Producto
            </h1>

            <Formulario onSubmit={handleSubmit} noValidate>
              <fieldset>
                <legend>Información General</legend>

                <Campo>
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    placeholder="Nombre del Producto"
                    name="nombre"
                    value={nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.nombre && <Error> {errores.nombre}</Error>}

                <Campo>
                  <label htmlFor="empresa">Empresa</label>
                  <input
                    type="text"
                    id="empresa"
                    placeholder="Nombre Empresa"
                    name="empresa"
                    value={empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.empresa && <Error> {errores.empresa}</Error>}

                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  {/* <input
                  type="file"
                  id="imagen"
                  name="imagen"
                  value={imagen}
                  onChange={handleChange}
                  onBlur={handleBlur}
                /> */}
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleImageUpload}
                  />
                </Campo>

                {errores.imagen && <Error> {errores.imagen}</Error>}

                <Campo>
                  <label htmlFor="url">Url</label>
                  <input
                    type="url"
                    id="url"
                    placeholder="Url de tu Producto"
                    name="url"
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.url && <Error> {errores.url}</Error>}
              </fieldset>

              <fieldset>
                <legend> Sobre el Producto</legend>

                <Campo>
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>

                {errores.descripcion && <Error> {errores.descripcion}</Error>}
              </fieldset>

              {error && <Error>{error}</Error>}

              <InputSubmit type="submit" value="Crear Producto" />
            </Formulario>
          </>
        )}
      </Layout>
    </div>
  );
};

export default NuevoProducto;
