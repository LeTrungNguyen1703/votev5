import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [CatsModule, UsersModule, PrismaModule],
})
export class AppModule {
}
