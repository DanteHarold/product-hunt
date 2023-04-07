import React, { useEffect, useState } from "react";

export default function useValidacion(stateInicial, validar, fn) {
  const [valores, setValores] = useState(stateInicial);
  const [errores, setErrores] = useState({});
  const [submitForm, setSubmitForm] = useState(false);

  useEffect(() => {
    if (submitForm) {
      const noErrores = Object.keys(errores).length === 0;
      if (noErrores) {
        fn(); //* Función que se ejecuta en el componente
      }
      setSubmitForm(false);
    }
  }, [errores]);

  //* Función que se ejecuta conforme el usuario escribe algo
  const handleChange = (e) => {
    setValores({
      ...valores,
      [e.target.name]: e.target.value,
    });
  };

  const handleBlur = () => {
    const erroresValidacion = validar(valores);
    setErrores(erroresValidacion);
  };

  //* Función que se ejecuta cuando el usuario hace el submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresValidacion = validar(valores);
    setErrores(erroresValidacion);
    setSubmitForm(true);
  };

  return {
    valores,
    setValores,
    errores,
    submitForm,
    handleChange,
    handleSubmit,
    handleBlur,
  };
}
