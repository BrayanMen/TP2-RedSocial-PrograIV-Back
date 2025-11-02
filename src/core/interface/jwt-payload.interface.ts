import { UserRole } from '../constants/roles.constant';

export interface JwtPayload {
  sub: string; // Identifica el dueño del token (Subject) se usa el id por convencion
  email: string; // se usa para validaciones rapidas
  username: string;
  role: UserRole; //Para manejo de roles sin consultas a la DB
  iat?: number; // Firma de tiempo para medir desde que se genero el token
  exp?: number; // Cuando se vence el token
}
