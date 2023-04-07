export default function validarCrearProducto(valores) {
  let errores = {};

  //*Validar el nombre del usuario
  if (!valores.nombre) {
    errores.nombre = "El Nombre es Obligatorio";
  }

  //*Validar la empresa
  if (!valores.empresa) {
    errores.empresa = "El Nombre de la empresa es obligatorio";
  }

  //*Validar la Url
  if (!valores.url) {
    errores.url = "La url del producto es obligatoria";
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
    errores.url = "Url no Válida";
  }

  //*Validar la descripción
  if (!valores.descripcion) {
    errores.descripcion = "El descripcion es obligatoria";
  }

  return errores;
}
