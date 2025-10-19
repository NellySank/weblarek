import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
  private items: IProduct[] = [];

   constructor(private events: IEvents) {} 

   // Получить список товаров в корзине
  public getItems(): IProduct[] {
    return this.items;
  }

  // Добавить товар 
  public addItem(product: IProduct): void {
    this.items.push(product);
    this.events.emit('basket:changed'); 
  }

  // Удалить товар из корзины
  public removeItem(product: IProduct): void {
    const index = this.items.findIndex(item => item.id === product.id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    this.events.emit('basket:changed'); 
  }

  // удалить товар из корзины по id
  public removeItemById(id: string): void {
    this.items = this.items.filter(item => item.id !== id);
    this.events.emit('basket:changed'); 
  }

   // Очистить корзину
  public clear(): void {
    this.items = [];
    this.events.emit('basket:changed');
  }

   // Получить общую сумму товаров в корзине
  public getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  // Получить количество товаров в корзине
  public getItemCount(): number {
    return this.items.length;
  }

  // Узнать наличие товара в корзине (по id)
  public hasItem(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
 
}