import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ➕ Créer un utilisateur
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: Partial<User>) {
    // Le service gère déjà la validation du phone unique
    return this.usersService.create(data);
  }

  // 👁️ Récupérer tous les utilisateurs
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.usersService.findAll();
  }

  // 👁️ Récupérer un utilisateur par ID
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // ✏️ Mettre à jour un utilisateur
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() data: Partial<User>) {
    return this.usersService.update(id, data);
  }

  // ❌ Supprimer un utilisateur
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
