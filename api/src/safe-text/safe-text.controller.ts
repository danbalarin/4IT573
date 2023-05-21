import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateSafeTextDto } from './dto/create-safe-text.dto';
import { SafeTextService } from './safe-text.service';
import { UpdateSafeTextDto } from './dto/update-safe-text.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser, AuthUserType } from '../auth/auth.decorator';

@Controller('safe-text')
@UseGuards(AuthGuard)
export class SafeTextController {
  constructor(private readonly safeTextService: SafeTextService) {}
  @Post()
  create(
    @Body() createSafeTextDto: CreateSafeTextDto,
    @AuthUser() user: AuthUserType,
  ) {
    return this.safeTextService.create(+user.sub, createSafeTextDto);
  }

  @Get()
  findAll(@AuthUser() user: AuthUserType) {
    return this.safeTextService.findManyByUserId(+user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @AuthUser() user: AuthUserType) {
    const text = await this.safeTextService.findOne(+id);

    if (!text || text.userId !== +user.sub) {
      throw new NotFoundException();
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSafeTextDto: UpdateSafeTextDto,
  ) {
    return this.safeTextService.update(+id, updateSafeTextDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @AuthUser() user: AuthUserType) {
    const text = await this.safeTextService.findOne(+id);

    if (!text || text.userId !== +user.sub) {
      throw new NotFoundException();
    }
    return this.safeTextService.delete(+id);
  }
}
