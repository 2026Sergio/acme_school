// Funciones pequeñas y reutilizables para que los modelos no repitan lógica de validación.
export function requerido(valor, nombre, { min = 1, max = 255 } = {}) {
  if (valor === undefined || valor === null || String(valor).trim().length < min || String(valor).length > max) {
    return `${nombre}: requerido, entre ${min} y ${max} caracteres`;
  }
  return null;
}

export function numeroEntero(valor, nombre, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  const n = Number(valor);
  if (!Number.isInteger(n) || n < min || n > max) return `${nombre}: entero entre ${min} y ${max}`;
  return null;
}

export function enumerado(valor, nombre, opciones) {
  if (!opciones.includes(valor)) return `${nombre}: debe ser uno de [${opciones.join(', ')}]`;
  return null;
}

export function email(valor, nombre) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!valor || !regex.test(valor)) return `${nombre}: formato de email inválido`;
  return null;
}

export function lanzarSiHayErrores(entidad, errores) {
  const lista = errores.filter(Boolean);
  if (lista.length > 0) throw new Error(`Validación de ${entidad} falló:\n - ${lista.join('\n - ')}`);
}
