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
import { throwIfNotOwner } from './utils/throw-if-not-owner';

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

    throwIfNotOwner(user.sub, text);

    return text;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSafeTextDto: UpdateSafeTextDto,
    @AuthUser() user: AuthUserType,
  ) {
    const text = await this.safeTextService.findOne(+id);

    throwIfNotOwner(user.sub, text);

    try {
      return this.safeTextService.update(+id, updateSafeTextDto);
    } catch {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @AuthUser() user: AuthUserType) {
    const text = await this.safeTextService.findOne(+id);

    throwIfNotOwner(user.sub, text);

    return this.safeTextService.delete(+id);
  }
}
