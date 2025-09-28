export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TPayment = 'online' | 'cash' | null;

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
};

// для GET
export type TProductsResponse = {
    total: number;
    items: IProduct[];
};

// для POST
export type TOrderData = IBuyer & {
    total: number;
    items: string[];
};

export type TOrderSuccessResponse = {
    id: string;
    total: number;
};

export type TOrderErrorResponse = {
    error: string;
};

export type TOrderResponse = TOrderSuccessResponse | TOrderErrorResponse;

export class WebLarekAPI {
    private api: IApi;

    // Конструктор
    constructor(api: IApi) {
        this.api = api;
    }

    // Метод для получения списка товаров
    getProducts(): Promise<IProduct[]> {
        return this.api
            .get<TProductsResponse>('/product/')
            .then((response: TProductsResponse) => response.items);
    }

    // Метод для создания заказа
    createOrder(order: TOrderData): Promise<TOrderResponse> {
        return this.api.post<TOrderResponse>('/order/', order, 'POST')
         .then((response: TOrderResponse) => {
                if ('error' in response) {
                    throw new Error(response.error);
                }
                return response;
            })
            .catch((error) => {
                throw new Error(`Ошибка при создании заказа: ${error.message}`);
            });
    }
}


