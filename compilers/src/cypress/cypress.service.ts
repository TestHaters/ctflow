import { Injectable } from '@nestjs/common';
import { Compiler } from './compiler';
import { CompileCypressDto } from './dto/compile-cypress.dto';

@Injectable()
export class CypressService {
  compile(compileCypressDto: CompileCypressDto) {
    return Compiler.compile(compileCypressDto);
  }

  findAll() {
    return `This action returns all cypress`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cypress`;
  }

  // update(id: number, updateCypressDto: UpdateCypressDto) {
  //   return `This action updates a #${id} cypress`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} cypress`;
  // }
}
