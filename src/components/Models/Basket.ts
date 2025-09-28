import { IProduct } from "../../types";

export class Basket {
  private items: IProduct[] = [];

   // Получить список товаров в корзине
  public getItems(): IProduct[] {
    return this.items;
  }

  // Добавить товар 
  public addItem(product: IProduct): void {
    this.items.push(product);
  }

  // Удалить товар из корзины
  public removeItem(product: IProduct): void {
    const index = this.items.findIndex(item => item.id === product.id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  // удалить товар из корзины по id
  public removeItemById(id: string): void {
    this.items = this.items.filter(item => item.id !== id);
  }

   // Очистить корзину
  public clear(): void {
    this.items = [];
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