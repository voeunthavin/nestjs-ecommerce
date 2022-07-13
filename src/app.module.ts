import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://cluster0.ilxtr.mongodb.net', {
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASS,
    dbName: process.env.MONGODB_NAME,
    w: 'majority',
    retryWrites: true
  }), ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
