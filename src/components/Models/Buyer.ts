import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export type TValidationErrors = {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
};

export class Buyer implements IBuyer {
  private _payment: TPayment = null;
  private _address: string = '';
  private _email: string = '';
  private _phone: string = '';

  // Конструктор для инициализации
  constructor(private events: IEvents) { }

  // Сохранение данных
  public setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.address !== undefined) this._address = data.address;
    if (data.email !== undefined) this._email = data.email;
    if (data.phone !== undefined) this._phone = data.phone;
  }

  // Получение данных
  public getData(): IBuyer {
    return {
      payment: this._payment,
      address: this._address,
      email: this._email,
      phone: this._phone,
    };
  }

  // Проверка данных: все поля должны быть заполнены
  public isValid(): boolean {
    return (
      this._payment !== null &&
      this._address.trim() !== '' &&
      this._email.trim() !== '' &&
      this._phone.trim() !== ''
    );
  }

   // Очистка данных покупателя
  public clearData(): void {
    this._payment = null;
    this._address = '';
    this._email = '';
    this._phone = '';
  }

  // Валидация данных: возвращает объект с ошибками только для невалидных полей
  public validate(): TValidationErrors {
    const errors: TValidationErrors = {};

    if (this._payment === null) {
      errors.payment = 'Не выбран вид оплаты';
    }

    if (this._address.trim() === '') {
      errors.address = 'Укажите адрес';
    }

    if (this._email.trim() === '') {
      errors.email = 'Укажите email';
    }

    if (this._phone.trim() === '') {
      errors.phone = 'Укажите телефон';
    }

    return errors;
  }

  // Геттеры 
  public get payment(): 'card' | 'cash' | null {
    return this._payment;
  }

  public get address(): string {
    return this._address;
  }

  public get email(): string {
    return this._email;
  }

  public get phone(): string {
    return this._phone;
  }

  // Сеттеры
  public set payment(value: TPayment) {
    this._payment = value;
  }

  public set address(value: string) {
    this._address = value;
  }

  public set email(value: string) {
    this._email = value;
  }

  public set phone(value: string) {
    this._phone = value;
  }
}