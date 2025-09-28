import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prisma } from '../../database';

@Injectable()
export class UserService {

  async create(createUserDto: CreateUserDto) {
    // Hash the provided password (field is named `passwordHash` in the DTO)
    const hashed = await bcrypt.hash(createUserDto.passwordHash, 10);

    return prisma.user.create({
      data: {
        ...createUserDto,
        passwordHash: hashed,
      },
      omit: {
        passwordHash: true,
      },
    });
  }

  async findAll() {
    return prisma.user.findMany({omit: { passwordHash: true }});
  }

  async findOne(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      omit: { passwordHash: true },
    });

    if (!user) {
      throw new Error(`User with ID ${id} does not exist.`);
    }

    return user;
  }

  async update(id: number, updateUserDto: Partial<CreateUserDto>) {
    try {
      // If a new password is provided, hash it before updating
      if (updateUserDto.passwordHash) {
        updateUserDto.passwordHash = await bcrypt.hash(updateUserDto.passwordHash, 10);
      }

      return prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Error(`User with ID ${id} does not exist.`);
      }
    }
  }

  remove(id: number) {
    try {
      return prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Error(`User with ID ${id} does not exist.`);
      }
    }
  }
}
