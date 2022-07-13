import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductController } from './product/product.controller';
import { ProductModule } from './product/product.module';
import { ProductService } from './product/product.service';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import 'dotenv/config'

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://cluster0.ilxtr.mongodb.net', {
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASS,
    dbName: process.env.MONGODB_NAME,
    w: 'majority',
    retryWrites: true
  }), ProductModule, UserModule, AuthModule],
  controllers: [AppController, ProductController],
  providers: [AppService, ProductService, UserService],
})
export class AppModule { }
