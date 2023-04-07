import useAutenticacion from "@/hooks/useAutenticacion";
import App from "next/app";
import firebase, { FirebaseContext } from "../firebase";

export default function MyApp(props) {
  const { Component, pageProps } = props;
  const usuario = useAutenticacion();
  return (
    <FirebaseContext.Provider value={{ firebase, usuario }}>
      <Component {...pageProps} />
    </FirebaseContext.Provider>
  );
}
