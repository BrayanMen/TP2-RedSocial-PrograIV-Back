import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';
import { ERROR_MESSAGES } from '../../core/constants/error-message.constant';
import { CloudinaryUploadResponse } from '../../core/interface/ICloudinary-result.interface';

@Injectable()
export class CloudinaryService {
  private readonly allowedTypes: string[];
  private readonly maxSize: number;
  private readonly folder: string;

  constructor(private configService: ConfigService) {
    const cloudinaryUrl = this.configService.get<string>('CLOUDINARY_URL');

    if (cloudinaryUrl) {
      v2.config({ cloudcloudinary_url: cloudinaryUrl });
    } else {
      v2.config({
        cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
        api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
        api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        secure: true,
      });
    }
    this.allowedTypes = (
      this.configService.get<string>('ALLOWED_FILE_TYPES') ||
      'image/jpeg,image/png,image/jpg,image/webp'
    ).split(',');
    this.maxSize =
      this.configService.get<number>('MAX_FILE_SIZE_BYTES') || 5242880;
    this.folder =
      this.configService.get<string>('CLOUDINARY_UPLOAD_FOLDER') ||
      'oos-social-network';
  }
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<CloudinaryUploadResponse> {
    if (!file) {
      throw new BadGatewayException(ERROR_MESSAGES.BAD_REQUEST);
    }
    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_FILE_TYPE);
    }
    if (file.size > this.maxSize) {
      throw new BadRequestException(ERROR_MESSAGES.FILE_TOO_LARGE);
    }

    return new Promise((resolve, reject) => {
      const uploadStream = v2.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: this.folder,
          transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) {
            console.error('Error al subir imagen:', error);
            reject(new BadRequestException('Error al subir la imagen'));
          }

          if (result) resolve(result as CloudinaryUploadResponse);
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  async deleteImage(id: string): Promise<void> {
    try {
      await v2.uploader.destroy(id);
    } catch (error) {
      console.error('Error al eliminar imagen en Cloudi:', error);
      throw new Error('Error al eliminar imagen');
    }
  }
  getPublicId(imageUrl: string) {
    // Extrae el public_id de la URL de Cloudinary
    if (!imageUrl) {
      throw new Error('Image URL is required');
    }
    // Las URLs de Cloudinary tienen el formato:
    // https://res.cloudinary.com/<cloud_name>/<resource_type>/<type>/<version>/<public_id>.<format>
    const urlParts = imageUrl.split('/');
    // Encuentra el índice donde está 'upload'
    const uploadIndex = urlParts.findIndex((part) => part === 'upload');

    if (uploadIndex === -1) {
      throw new Error('Invalid Cloudinary URL');
    }
    // El public_id está después de la versión (que está después de 'upload')
    // Formato: .../upload/v1234567890/public_id.jpg
    const versionIndex = uploadIndex + 2; // saltar 'upload' y 'v1234567890'

    if (versionIndex >= urlParts.length - 1) {
      throw new Error('Invalid Cloudinary URL format');
    }
    // Toma todas las partes desde versionIndex hasta el final
    const publicIdWithExtension = urlParts.slice(versionIndex).join('/');
    // Remueve la extensión del archivo
    const publicId = publicIdWithExtension.split('.')[0];
    return publicId;
  }
}
