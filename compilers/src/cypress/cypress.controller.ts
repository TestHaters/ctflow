import {
  Controller,
  Post,
  Body,
  // Get,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { CypressService } from './cypress.service';
import { CompileCypressDto, CreateCypressDto } from './dto/create-cypress.dto';
// import { UpdateCypressDto } from './dto/update-cypress.dto';

@Controller('cypress')
export class CypressController {
  constructor(private readonly cypressService: CypressService) {}

  @Post()
  compile(@Body() compileCypress: CompileCypressDto) {
    console.log('compileCypress', compileCypress);
    return this.cypressService.compile(compileCypress);
  }

  // @Get()
  // findAll() {
  //   return this.cypressService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cypressService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCypressDto: UpdateCypressDto) {
  //   return this.cypressService.update(+id, updateCypressDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.cypressService.remove(+id);
  // }
}
