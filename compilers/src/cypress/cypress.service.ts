import { Injectable } from '@nestjs/common';
import { CompileCypressDto, CreateCypressDto } from './dto/create-cypress.dto';
import { UpdateCypressDto } from './dto/update-cypress.dto';

@Injectable()
export class CypressService {
  compile(compileCypressDto: CompileCypressDto) {
    console.log('compileCypressDto', compileCypressDto);

    return 'This action adds a new cypress';
  }

  findAll() {
    return `This action returns all cypress`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cypress`;
  }

  update(id: number, updateCypressDto: UpdateCypressDto) {
    return `This action updates a #${id} cypress`;
  }

  remove(id: number) {
    return `This action removes a #${id} cypress`;
  }
}
