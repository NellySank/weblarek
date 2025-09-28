import { Api } from './components/base/Api';
import { Card } from './components/Models/Card';
import { Catalog } from './components/Models/Catatog';
import { Buyer } from './components/Models/Buyer';
import './scss/styles.scss';
import { IProduct, WebLarekAPI } from './types';
import { API_URL } from './utils/constants'

const baseApi = new Api(API_URL);
const catalogModel = new Catalog();
const cardModel = new Card();
const buyerModel = new Buyer();

//  ************************
//  тестирование класса Card
//  ************************

console.log('************************');
console.log('тестирование класса Card');
console.log('************************');

// Тестовые данные
const testProducts: IProduct[] = [
    {
        "id": "854cef69-976d-4c2a-a18c-2aa45046c390",
        "description": "Если планируете решать задачи в тренажёре, берите два.",
        "image": "/5_Dots.svg",
        "title": "+1 час в сутках",
        "category": "софт-скил",
        "price": 750
    },
    {
        "id": "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
        "description": "Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.",
        "image": "/Shell.svg",
        "title": "HEX-леденец",
        "category": "другое",
        "price": 1450
    },
    {
        "id": "b06cde61-912f-4663-9751-09956c0eed67",
        "description": "Будет стоять над душой и не давать прокрастинировать.",
        "image": "/Asterisk_2.svg",
        "title": "Мамка-таймер",
        "category": "софт-скил",
        "price": null
    }
];

console.log('Тестирование getItems(): Получение списка товаров в корзине (изначально пусто):', [...cardModel.getItems()]);

console.log('Тестирование addItem(): Добавление первого товара (+1 час в сутках)');
cardModel.addItem(testProducts[0]);
console.log('Список товаров после добавления первого товара (1шт):', [...cardModel.getItems()]);

console.log('Тестирование addItem(): Добавление второго товара (HEX-леденец)');
cardModel.addItem(testProducts[1]);
console.log('Список товаров после добавления второго товара (2шт):', [...cardModel.getItems()]);

console.log('Тестирование addItem(): Добавление третьего товара (Мамка-таймер)');
cardModel.addItem(testProducts[2]);
console.log('Список товаров после добавления третьего товара (3шт):', [...cardModel.getItems()]);

console.log('Тестирование getItemCount(): Количество товаров в корзине (должно быть 3):', cardModel.getItemCount());

console.log('Тестирование getTotalPrice(): Общая сумма товаров в корзине (с учётом null цены):', cardModel.getTotalPrice());

console.log('Тестирование hasItem(): Наличие товара с id "854cef69-976d-4c2a-a18c-2aa45046c390" (должен быть true):', cardModel.hasItem('854cef69-976d-4c2a-a18c-2aa45046c390'));
console.log('Тестирование hasItem(): Наличие товара с id "nonexistent" (должен быть false):', cardModel.hasItem('nonexistent'));

console.log('Тестирование removeItem(): Удаление товара "HEX-леденец" по объекту');
cardModel.removeItem(testProducts[1]);
console.log('Список товаров после удаления:', [...cardModel.getItems()]);
console.log('Количество товаров после удаления:', cardModel.getItemCount());
console.log('Общая сумма после удаления:', cardModel.getTotalPrice());

console.log('Тестирование removeItemById(): Удаление товара с id "854cef69-976d-4c2a-a18c-2aa45046c390"');
cardModel.removeItemById('854cef69-976d-4c2a-a18c-2aa45046c390');
console.log('Список товаров после удаления по id:', [...cardModel.getItems()]);
console.log('Количество товаров после удаления по id:', cardModel.getItemCount());
console.log('Общая сумма после удаления по id:', cardModel.getTotalPrice());

console.log('Тестирование clear(): Очистка корзины');
cardModel.clear();
console.log('Список товаров после очистки (должен быть пустым):', [...cardModel.getItems()]);
console.log('Количество товаров после очистки (должно быть 0):', cardModel.getItemCount());
console.log('Общая сумма после очистки (должна быть 0):', cardModel.getTotalPrice());
console.log('Проверка hasItem() после очистки (должен быть false):', cardModel.hasItem('b06cde61-912f-4663-9751-09956c0eed67'));

console.log('Дополнительное тестирование: Добавление товара после очистки');
cardModel.addItem(testProducts[0]);
console.log('Список товаров после добавления:', [...cardModel.getItems()]);
console.log('Количество товаров:', cardModel.getItemCount());
console.log('Общая сумма:', cardModel.getTotalPrice());


//  ************************
//  тестирование класса Buyer
//  ************************

console.log('************************');
console.log('тестирование класса Buyer');
console.log('************************');

// Тестовые данные для Buyer
const testBuyerData: Partial<Buyer> = {
    payment: 'online',
    address: 'ул. Стасова, 60 кв 67',
    email: 'ivanov_ii@yandex.ru',
    phone: '+7 (999) 123-45-67',
};

console.log('Тестирование конструктора: Создание Buyer без данных');
console.log('getData() (должен быть пустым):', { ...buyerModel.getData() });
console.log('isValid() (должен быть false):', buyerModel.isValid());
console.log('validate() (должен содержать ошибки для всех полей):', { ...buyerModel.validate() });

const buyerPartial = new Buyer({ payment: 'cash', email: 'partial@example.com' });
console.log('Тестирование конструктора: Создание Buyer с частичными данными (payment и email)');
console.log('getData():', { ...buyerPartial.getData() });
console.log('isValid() (должен быть false, так как address и phone пустые):', buyerPartial.isValid());
console.log('validate():', { ...buyerPartial.validate() });

const buyerFull = new Buyer(testBuyerData);
console.log('Тестирование конструктора: Создание Buyer с полными данными');
console.log('getData():', { ...buyerFull.getData() });
console.log('isValid() (должен быть true):', buyerFull.isValid());
console.log('validate() (должен быть пустым объектом):', { ...buyerFull.validate() });

console.log('Тестирование setData(): Установка частичных данных (address и phone)');
buyerModel.setData({ address: 'ул. Пушкина, д. 1', phone: '+7 (888) 765-43-21' });
console.log('getData() после setData():', { ...buyerModel.getData() });
console.log('isValid() (должен быть false, так как payment и email пустые):', buyerModel.isValid());
console.log('validate():', { ...buyerModel.validate() });

console.log('Тестирование setData(): Установка полных данных');
buyerModel.setData(testBuyerData);
console.log('getData() после полной setData():', { ...buyerModel.getData() });
console.log('isValid() (должен быть true):', buyerModel.isValid());
console.log('validate() (должен быть пустым):', { ...buyerModel.validate() });

console.log('Тестирование clearData(): Очистка данных');
buyerFull.clearData();
console.log('getData() после clearData():', { ...buyerFull.getData() });
console.log('isValid() (должен быть false):', buyerFull.isValid());
console.log('validate() (должен содержать ошибки для всех полей):', { ...buyerFull.validate() });

console.log('Тестирование геттеров и сеттеров: Установка значений через сеттеры');
buyerModel.payment = 'online';
buyerModel.address = 'ул. Гагарина, д. 5';
buyerModel.email = 'setter@example.com';
buyerModel.phone = '+7 (777) 111-22-33';
console.log('getData() после установки через сеттеры:', { ...buyerModel.getData() });
console.log('isValid() (должен быть true):', buyerModel.isValid());
console.log('validate() (должен быть пустым):', { ...buyerModel.validate() });

console.log('Тестирование геттеров: Получение значений');
console.log('payment:', buyerModel.payment);
console.log('address:', buyerModel.address);
console.log('email:', buyerModel.email);
console.log('phone:', buyerModel.phone);

console.log('Тестирование validate(): Частично заполненные данные (только payment)');
buyerFull.setData({ payment: 'cash' });
console.log('validate():', { ...buyerFull.validate() });
console.log('isValid() (должен быть false):', buyerFull.isValid());

// Тестирование с null payment
console.log('Тестирование: Установка payment в null');
buyerFull.payment = null;
console.log('validate():', { ...buyerFull.validate() });
console.log('isValid() (должен быть false):', buyerFull.isValid());


//  ************************
//  тестирование класса Catalog
//  ************************
console.log('***************************');
console.log('тестирование класса Catalog');
console.log('***************************');

// Тестовые данные
const testProduct1: IProduct = {
    id: '1',
    description: 'Описание товара 1',
    image: 'image1.jpg',
    title: 'Товар 1',
    category: 'Категория 1',
    price: 100,
};

const testProduct2: IProduct = {
    id: '2',
    description: 'Описание товара 2',
    image: 'image2.jpg',
    title: 'Товар 2',
    category: 'Категория 2',
    price: null,
};

const testProductsArr: IProduct[] = [testProduct1, testProduct2];

const catalog = new Catalog();
console.log('Тестирование конструктора: Создание Catalog');
console.log('getProducts() (должен быть пустым массивом):', [...catalog.getProducts()]);
console.log('getSelectedProduct() (должен быть null):', catalog.getSelectedProduct());

console.log('Тестирование setProducts(): Установка массива товаров');
catalog.setProducts(testProductsArr);
console.log('getProducts() после setProducts():', [...catalog.getProducts()]);
console.log('getSelectedProduct() (должен быть null, так как ничего не выбрано):', catalog.getSelectedProduct());

console.log('Тестирование selectProductById(): Выбор товаров с id "1"');
catalog.selectProductById('1');
console.log('getSelectedProduct() после selectProductById("1"):', { ...catalog.getSelectedProduct() });
console.log('getProducts() (не должен измениться):', [...catalog.getProducts()]);

console.log('Тестирование selectProductById(): Выбор товара с несуществующим id "999"');
catalog.selectProductById('999');
console.log('getSelectedProduct() после selectProductById("999") (должен быть null):', catalog.getSelectedProduct());

console.log('Тестирование setSelectedProduct(): Установка выбранного товарв вручную');
catalog.setSelectedProduct(testProduct2);
console.log('getSelectedProduct() после setSelectedProduct():', { ...catalog.getSelectedProduct() });

console.log('Тестирование selectProductById(): Попытка выбора после пустого массива');
catalog.setProducts([]);
catalog.selectProductById('1');
console.log('getSelectedProduct() (должен быть null, так как товар не найден):', catalog.getSelectedProduct());

console.log('Восстановление: Установка тестовых товаров обратно');
catalog.setProducts(testProductsArr);
console.log('getProducts():', [...catalog.getProducts()]);

console.log('Тестирование: Выбор товара с price: null');
catalog.selectProductById('2');
console.log('getSelectedProduct():', { ...catalog.getSelectedProduct() });


const webLarekApi = new WebLarekAPI(baseApi);
webLarekApi.getProducts()
    .then((products: IProduct[]) => {
        catalogModel.setProducts(products);        
        console.log('Список товаров с сервера: ', catalogModel.getProducts());
    })
    .catch((error) => {
        console.error('Ошибка при получении товаров с сервера:', error);
    });
