import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException) //Decorardor para atrapar errores y excepcion de las solicitudes HttpException
export class HttpExceptionFilter implements ExceptionFilter {
  //Uso interfaz que me permite el comportamiento de filtro de excepcion
  catch(exception: HttpException, host: ArgumentsHost) {
    // host se utiliza para contener las peticiones Response y Request
    const context = host.switchToHttp(); //Convierte a un contexto HTTP y es obligado a solo trabajar dentro de esas solicitudes
    const res = context.getResponse<Response>(); //Siempre tipar ya que Nest no sabes que tipo solicitud devuelve
    const req = context.getRequest<Request>();
    const status = exception.getStatus(); // Trae el codigo de status correcto (400, 404, 500)
    const excepcionRes = exception.getResponse(); // Trae que error tiene

    const message =
      typeof excepcionRes === 'object' && 'message' in excepcionRes
        ? excepcionRes.message
        : exception.message;
    const errorRes = {
      succes: false,
      statusCode: status,
      timeStamo: new Date().toISOString(),
      path: req.url,
      method: req.method,
      error: message,
    };
    res.status(status).json(errorRes);
  }
}
