import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ItemDTO } from './dtos/item.dto';
import { Cart, CartDocument } from './schemas/cart.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel('Cart') private readonly cartModel: Model<CartDocument>,
  ) {}

  async createCart(
    userId: string,
    itemDTO: ItemDTO,
    subTotalPrice: number,
    totalPrice: number,
  ): Promise<Cart> {
    const newCart = await this.cartModel.create({
      userId,
      items: [{ ...itemDTO, subTotalPrice }],
      totalPrice,
    });
    return newCart;
  }

  async getCart(userId: string): Promise<CartDocument> {
    const cart = await this.cartModel.findOne({ userId });
    return cart;
  }

  async deleteCart(userId: string): Promise<Cart> {
    const deletedCart = await this.cartModel.findOneAndDelete({ userId });
    return deletedCart;
  }

  private recalculateCart(cart: CartDocument) {
    cart.totalPrice = 0;
    cart.items.forEach((item) => {
      cart.totalPrice += item.quantity * item.price;
    });
  }

  async addItemToCart(userId: string, itemDTO: ItemDTO): Promise<Cart> {
    const { productId, quanity, price } = itemDTO;
    const subTotalPrice = quanity * price;

    const cart = await this.getCart(userId);
    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId == productId,
      );
      if (itemIndex > -1) {
        const item = cart.items[itemIndex];
        item.quantity = Number(item.quantity) + Number(quanity);
        item.subTotalPrice = item.quantity * item.price;

        cart.items[itemIndex] = item;
        this.recalculateCart(cart);
        return cart.save();
      } else {
        cart.items.push({
          ...itemDTO,
          subTotalPrice,
          quantity: 0,
        });
        this.recalculateCart(cart);
        return cart.save();
      }
    } else {
      const newCart = await this.createCart(
        userId,
        itemDTO,
        subTotalPrice,
        price,
      );
      return newCart;
    }
  }

  async removeItemFromCart(userId: string, productId: string): Promise<any> {
    const cart = await this.getCart(userId);

    const itemIndex = cart.items.findIndex(
      (item) => item.productId == productId,
    );

    if (itemIndex > -1) {
      cart.items.slice(itemIndex, 1);
      return cart.save();
    }
  }
}
