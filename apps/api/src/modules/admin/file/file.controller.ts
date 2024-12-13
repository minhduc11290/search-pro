import { Controller, Get, Param, Res, UseGuards, Post, UseInterceptors, BadRequestException, UploadedFiles, Delete, NotFoundException } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { join } from 'path';
import { RolesGuard } from '~/decorators/role-guard.decorator';
import { JwtGuard } from '~/modules/share/auth/guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';


@ApiTags('Admin - Files')
@Controller('admin/files')
export class FileController {
  @Get(':filename')
  @ApiOperation({ summary: 'Get a file from the public folder' })
  @ApiResponse({ status: 200, description: 'Returns the requested file' })
  etFile(@Param('filename') filename: string, @Res() res: Response): void {
    //FIXME: This is a temporary solution, we should use a service to get the file
    const filePath = join(__dirname, '../../../../', '..', 'public', filename);
    res.sendFile(filePath);
  }


  @Post('uploads')
  @RolesGuard('SUPER_ADMIN', 'STORE_OWNER')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload multiple image files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload files',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Files uploaded successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid file format or size.' })
  @UseInterceptors(
    FilesInterceptor('files', 10, { // Tên field và số file tối đa (10 file)
      storage: diskStorage({
        destination: join(__dirname, '../../../../', '..', 'public'), // './uploads', // Thư mục lưu file
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const fileName = `products-${uniqueSuffix}${ext}`;
          callback(null, fileName);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn 5MB cho mỗi file
      },
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException('Chỉ cho phép upload các định dạng hình ảnh'),
            false,
          );
        }
      },
    }),
  )
  async uploadMultipleFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Không có file nào được upload');
    }
    return {
      message: 'Upload thành công!',
      files: files.map((file) => ({
        originalName: file.originalname,
        fileName: file.filename,
        path: `${file.filename}`,
      })),
    };
  }


  @Delete('image/:filename')
  async deleteImage(@Param('filename') filename: string) {
    // Kiểm tra filename có hợp lệ không
    if (!filename || filename.includes('..')) {
      throw new BadRequestException('Invalid file name.');
    }

    const filePath = join(__dirname, '../../../../', '..', 'public', filename);

    // Kiểm tra file có tồn tại không
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File ${filename} does not exist.`);
    }

    try {
      // Xóa file
      fs.unlinkSync(filePath);
      return {
        message: `File ${filename} has been deleted successfully.`,
      };
    } catch (error) {
      throw new BadRequestException(`Could not delete file: ${error}`);
    }
  }


}
