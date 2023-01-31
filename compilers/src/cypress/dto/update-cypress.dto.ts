import { PartialType } from '@nestjs/mapped-types';
import { CreateCypressDto } from './create-cypress.dto';

export class UpdateCypressDto extends PartialType(CreateCypressDto) {}
