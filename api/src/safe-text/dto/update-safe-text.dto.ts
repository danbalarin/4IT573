import { PartialType } from '@nestjs/mapped-types';
import { CreateSafeTextDto } from './create-safe-text.dto';

export class UpdateSafeTextDto extends PartialType(CreateSafeTextDto) {}
