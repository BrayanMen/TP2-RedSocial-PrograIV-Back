import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataService } from './data.service';

@ApiTags('Opciones de Formularios')
@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('profile-options')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener opciones para formularios de perfil' })
  @ApiResponse({
    status: 200,
    description: 'Listas de opciones obtenidas exitosamente.',
  })
  getProfileOptions() {
    return this.dataService.getProfileOptions();
  }
}
