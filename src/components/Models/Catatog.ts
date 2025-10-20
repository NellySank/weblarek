import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Catalog {
  private _products: IProduct[] = [];
  private _selectedProduct: IProduct | null = null;

  constructor(private events: IEvents) {} 

  // Сохранить массив товаров
  setProducts(products: IProduct[]): void {
    this._products = products;
    this.events.emit('catalog:change', products);
  }

 // Получить список товаров
  getProducts(): IProduct[] {
    return this._products;
  }

   // выбрать товар по id
  selectProductById(id: string): void {
    const found = this._products.find(p => p.id === id) || null;
    this._selectedProduct = found;
  }

   // Сохранить выбранный товар
  setSelectedProduct(product: IProduct): void {
    this._selectedProduct = product;
    this.events.emit('product:preview', product);

  }

  // получение товара для подробного отображения
   getSelectedProduct(): IProduct | null {
    return this._selectedProduct;
  }

}