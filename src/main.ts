import { Api } from "./components/base/Api";
import { Basket } from "./components/Models/Basket";
import { Catalog } from "./components/Models/Catatog";
import { Buyer, TValidationErrors } from "./components/Models/Buyer";
import "./scss/styles.scss";
import { IProduct, WebLarekAPI } from "./types";
import { API_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/Events";
import { Gallery } from "./components/Views/Gallery";
import { CardCatalog } from "./components/Views/CardCatalog";
import { cloneTemplate } from "./utils/utils.ts"
import { Header } from "./components/Views/Header.ts";
import { CardPreview } from "./components/Views/CardPreview.ts";
import { Modal } from "./components/Views/Modal.ts";
import { CardBasket } from "./components/Views/CardBasket.ts";
import { BasketModal } from "./components/Views/BasketModal.ts";
import { FormOrder } from "./components/Views/FormOrder.ts";

const baseApi = new Api(API_URL);
const events = new EventEmitter();
const catalogModel = new Catalog(events);

const BasketModel = new Basket(events);
const buyerModel = new Buyer();

const pageElement = document.querySelector('.page') as HTMLElement;
const gallery = new Gallery(events, pageElement);

const headerElement = document.querySelector('.header') as HTMLElement; 
const header = new Header(events, headerElement);

const modalElement = document.querySelector('.modal') as HTMLElement;
const modal = new Modal(events, modalElement);

events.on('catalog:change', (products: IProduct[]) => {
  const cardElements: HTMLElement[] = products.map((product) => {
    const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
    const card = new CardCatalog(cloneTemplate(cardTemplate), {
      onClick: () => {
        events.emit('catalog:select', product);
      },
    });
    return card.render(product);
  });
  gallery.render({ catalog: cardElements });
});

events.on('basket:open', () => {
  const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
  const basketView = new BasketModal(events, cloneTemplate(basketTemplate));

  const basketItems = BasketModel.getItems().map((item) => {
    const cardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement; 
    const card = new CardBasket(cloneTemplate(cardTemplate), {
      deleteCard: () => {
        BasketModel.removeItemById(item.id);
        events.emit('basket:remove', item);
        events.emit('basket:open'); 
      }
    });
    return card.render(item);
  });

  console.log(basketItems)

  basketView.catalog = basketItems;
  basketView.total = BasketModel.getTotalPrice();
  basketView.setButtonDisable(BasketModel.getItemCount() === 0);

  modal.content = basketView.render();
  modal.open();
});

events.on('catalog:select', (product: IProduct) => {
  const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
  
  const cardPreview = new CardPreview(cloneTemplate(previewTemplate), {
    toogleCardBasket: () => {
      if (BasketModel.hasItem(product.id)) {
        events.emit('basket:remove', product);
      } else {
        events.emit('basket:add', product);
      }
    }
  });

  if (!product.price) {
    cardPreview.setDisableButton(true);
  } else if (BasketModel.hasItem(product.id)) {
    cardPreview.setTextButton('Удалить из корзины');
  } else {
    cardPreview.setTextButton('Купить');
  }
  
  modal.content = cardPreview.render(product);
  modal.open();

});

events.on('basket:add', (product: IProduct) => {
  BasketModel.addItem(product);
});

events.on('basket:remove', (product: IProduct) => {
  BasketModel.removeItem(product); 
});

events.on('basket:changed', () => {
  header.counter = BasketModel.getItemCount();
  modal.close();
});

events.on('basket:order', () => {
  // Получаем шаблон формы заказа
  const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
  
  // Создаём экземпляр FormOrder с обработчиком отправки
  const formOrder = new FormOrder(cloneTemplate(orderTemplate), {
     validation: () => {
      events.emit('order:validation', formOrder);
     }
  });

  // Устанавливаем форму как содержимое модалки и открываем
  modal.content = formOrder.render();
  modal.open();
});

events.on('order:validation', (formOrder: FormOrder) => {
  console.log('validation');
 
  const errors: TValidationErrors = {};
  
  const cardButton = document.querySelector('.order__buttons button[name="card"]') as HTMLButtonElement;
  const cashButton = document.querySelector('.order__buttons button[name="cash"]') as HTMLButtonElement;
  const paymentSelected = cardButton?.classList.contains('button_alt-active') || cashButton?.classList.contains('button_alt-active');

    if (!paymentSelected) {
    errors.payment = 'Выберите способ оплаты';
  }

  const addressInput = document.querySelector('input[name="address"]') as HTMLInputElement;
  const addressValue = addressInput?.value.trim() || '';
  
  if (!addressValue) {
    errors.address = 'Введите адрес';
  }

   if (Object.keys(errors).length > 0) {
    formOrder.error = Object.values(errors).join(', ');
    formOrder.setDisableButton(true);
  } else {
    // Если ошибок нет — очищаем _errorsContainer и разблокируем кнопку
    formOrder.error = '';
    formOrder.setDisableButton(false);
  }

});




const webLarekApi = new WebLarekAPI(baseApi);
webLarekApi
  .getProducts()
  .then((products: IProduct[]) => {
    catalogModel.setProducts(products);
  })
  .catch((error) => {
    console.error("Ошибка при получении товаров с сервера:", error);
  });
