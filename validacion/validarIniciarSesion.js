export default function validarIniciarSesion(valores) {
  let errores = {};

  //*Validar el Email
  if (!valores.email) {
    errores.email = "El Email es Obligatorio";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email)) {
    errores.email = "Email no Valido";
  }

  //*Validar Password

  if (!valores.password) {
    errores.password = "El Password es obligatorio";
  } else if (valores.password.length < 6) {
    errores.password = "El Password debe ser mayor de 6 caracteres.";
  }

  return errores;
}
