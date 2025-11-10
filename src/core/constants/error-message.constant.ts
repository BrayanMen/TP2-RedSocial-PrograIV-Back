export const ERROR_MESSAGES = {
  //Errores de autenticacion
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  USER_ALREADY_EXISTS: 'El usuario ya existe',
  EMAIL_ALREADY_EXISTS: 'El correo electrónico ya está registrado',
  USERNAME_ALREADY_EXISTS: 'El nombre de usuario ya existe',
  UNAUTHORIZED: 'No autorizado',
  FORBIDDEN: 'No tienes permisos para realizar esta acción',
  TOKEN_EXPIRED: 'Token expirado',
  INVALID_TOKEN: 'Token inválido',

  // Errores de registro o usuario
  USER_NOT_FOUND: 'Usuario no encontrado',
  USER_DISABLED: 'Deshabilitado. Contacta al administrador',
  CANNOT_FOLLOW_YOURSELF: 'No puedes seguirte a ti mismo',
  CANNOT_BLOCK_YOURSELF: 'No puedes bloquearte a ti mismo',
  ALREADY_FOLLOWING: 'Ya sigues a este usuario',
  NOT_FOLLOWING: 'No sigues a este usuario',
  ALREADY_BLOCKED: 'Ya has bloqueado a este usuario',
  NOT_BLOCKED: 'No has bloqueado a este usuario',

  // Errores de validacion
  INVALID_EMAIL: 'Correo electrónico inválido',
  WEAK_PASSWORD:
    'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número',
  PASSWORDS_DO_NOT_MATCH: 'Las contraseñas no coinciden',
  INVALID_DATE: 'Fecha inválida',
  DATE_BIRTH_CANNOT_FUTURE:
    'La fecha de nacimiento no puede estar en el futuro',
  INVALID_AGE: 'Debes ser mayor de 13 años para registrarte',
  INVALID_FILE_TYPE: 'Tipo de archivo no permitido',
  FILE_TOO_LARGE: 'El archivo es demasiado grande',

  // Errores de sistema
  INTERNAL_SERVER_ERROR: 'Error interno del servidor',
  BAD_REQUEST: 'Solicitud incorrecta',
  NOT_FOUND: 'Recurso no encontrado',

  //Errores de Publicaciones
  NOT_FOUND_POST: 'Publicación no encontrada',
  NOT_FOUND_COMMENT: 'Comentario no encontrado',
  ALREADY_LIKE: 'Ya has dado me gusta a esta publicación',
  NOT_LIKE: 'No has dado me gusta a esta publicación',
  COMMENT_COULD_NOT_UPDATED: 'No se pudo actualizar el comentario',
};
