import Layout from "@/components/layout/Layout";
import { css } from "@emotion/react";
import Router from "next/router";
import React, { useState } from "react";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "@/components/ui/Formulario";

import firebase from "../firebase";

import useValidacion from "@/hooks/useValidacion";
import validarIniciarSesion from "@/validacion/validarIniciarSesion";

const STATE_INICIAL = {
  email: "",
  password: "",
};

const Login = () => {
  const [error, setError] = useState(false);

  const { errores, valores, handleSubmit, handleChange, handleBlur } =
    useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

  const { email, password } = valores;

  async function iniciarSesion() {
    try {
      await firebase.login(email, password);
      Router.push("/");
    } catch (e) {
      console.log("Hubo un error al autenticar el Usuario", e.message);
      setError(e.message);
    }
  }

  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-bottom: 5rem;
            `}
          >
            Iniciar Sesión
          </h1>

          <Formulario onSubmit={handleSubmit} noValidate>
            <Campo>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Tu Email"
                name="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>

            {errores.email && <Error> {errores.email}</Error>}
            <Campo>
              <label htmlFor="password">Email</label>
              <input
                type="password"
                id="password"
                placeholder="Tu Contraseña"
                name="password"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.password && <Error> {errores.password}</Error>}

            {error && <Error>{error}</Error>}

            <InputSubmit type="submit" value="Iniciar Sesión" />
          </Formulario>
        </>
      </Layout>
    </div>
  );
};

export default Login;
