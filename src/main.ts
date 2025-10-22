import { Api } from "./components/base/Api";
import { Basket } from "./components/Models/Basket";
import { Catalog } from "./components/Models/Catatog";
import { Buyer, TValidationErrors } from "./components/Models/Buyer";
import "./scss/styles.scss";
import { IBuyer, IProduct, TOrderData, TPayment, WebLarekAPI } from "./types";
import { API_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/Events";
import { Gallery } from "./components/Views/Gallery";
import { CardCatalog } from "./components/Views/card/CardCatalog.ts";
import { cloneTemplate, ensureElement } from "./utils/utils.ts"
import { Header } from "./components/Views/Header.ts";
import { CardPreview } from "./components/Views/card/CardPreview.ts";
import { Modal } from "./components/Views/Modal.ts";
import { CardBasket } from "./components/Views/card/CardBasket.ts";
import { BasketModal } from "./components/Views/BasketModal.ts";
import { FormOrder, TFormOrder } from "./components/Views/form/FormOrder.ts";
import { FormContact, IFormContacts } from "./components/Views/form/FormContact.ts";
import { SuccessPage } from "./components/Views/SuccessPage.ts";

const baseApi = new Api(API_URL);
const events = new EventEmitter();
const catalogModel = new Catalog(events);

const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const pageElement = ensureElement<HTMLElement>('.page');
const gallery = new Gallery(events, pageElement);

const headerElement = ensureElement<HTMLElement>('.header');
const header = new Header(events, headerElement);

const modalElement = ensureElement<HTMLElement>('.modal');
const modal = new Modal(events, modalElement);

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const basketView = new BasketModal(events, cloneTemplate(basketTemplate));

const orderContainer = cloneTemplate(orderTemplate);
const formOrder = new FormOrder(events, orderContainer, {
  onSubmit: (event) => {
    event.preventDefault(); 
    events.emit('basket:contacts');
  }});

const contactsContainer = cloneTemplate(contactsTemplate);
const formContact = new FormContact(events, contactsContainer, {
  onSubmit: (event) => {
    event.preventDefault(); 
    events.emit('order:send');
  }});

const createOrderData = (basket: Basket, buyer: Buyer): TOrderData => {
  if (!buyer.isValid()) {
    throw new Error('Не все поля формы заказа заполнены');
  }

  if (basket.getItemCount() === 0) {
    throw new Error('Не выбраны товары для заказа');
  }

  const orderData: TOrderData = {
    payment: buyer.payment,
    email: buyer.email,
    phone: buyer.phone,
    address: buyer.address,
    total: basket.getTotalPrice(),
    items: basket.getItems().map(item => item.id),
  };

  return orderData;
}

events.on('catalog:change', (products: IProduct[]) => {
  const cardElements: HTMLElement[] = products.map((product) => {
    
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => {
        events.emit('catalog:select', product);
      },
    });
    return card.render(product);
  });
  gallery.render({ catalog: cardElements });
});

events.on('basket:open', () => {
  
  modal.content = basketView.render();
  modal.open();
});

events.on('catalog:select', (product: IProduct) => {

  catalogModel.setSelectedProduct(product);

});

events.on('product:preview', (product: IProduct) => {

  const cardPreview = new CardPreview(cloneTemplate(previewTemplate), {
    toogleCardBasket: () => {
      if (basketModel.hasItem(product.id)) {
        events.emit('basket:remove', product);
        modal.close();
      } else {
        events.emit('basket:add', product);
        modal.close();
      }
    }
  });

  if (!product.price) {
    cardPreview.setDisableButton(true);
  } else if (basketModel.hasItem(product.id)) {
    cardPreview.setTextButton('Удалить из корзины');
  } else {
    cardPreview.setTextButton('Купить');
  }
  
  modal.content = cardPreview.render(product);
  modal.open();
  
})

events.on('basket:add', (product: IProduct) => {
  basketModel.addItem(product);
});

events.on('basket:remove', (product: IProduct) => {
  basketModel.removeItem(product); 
});

events.on('basket:changed', () => {
  header.counter = basketModel.getItemCount();

  const basketItems = basketModel.getItems().map((item, index) => {
    
    const card = new CardBasket(cloneTemplate(cardTemplate), {
      deleteCard: () => {
        basketModel.removeItemById(item.id);
      }
    });
    return card.render({ ...item, index: index + 1 });
  });

  basketView.catalog = basketItems;
  basketView.total = basketModel.getTotalPrice();
  basketView.setButtonDisable(basketModel.getItemCount() === 0);

});


events.on('basket:order', () => {

 const orderData: TFormOrder = {
  address: buyerModel.address ?? '',
  payment: buyerModel.payment ?? null,
  isDisableButton: buyerModel.address.trim() === '' ||  buyerModel.payment === null
 };

  modal.content = formOrder.render(orderData);
  modal.open();
});

events.on('address:change', (buyer: Partial<IBuyer>) => {
  buyerModel.address = buyer.address ?? '';
})

events.on('payment:change', (buyer: Partial<IBuyer>) => {
  if (buyer.payment) {
    buyerModel.payment = buyer.payment;
  }
})

events.on('order:validation', () => {
 
  const allErrors: TValidationErrors = buyerModel.validate();

  const orderFormErrors: TValidationErrors = {};
  if (allErrors.payment) orderFormErrors.payment = allErrors.payment;
  if (allErrors.address) orderFormErrors.address = allErrors.address;


  if (Object.keys(orderFormErrors).length > 0) {
    formOrder.error = Object.values(orderFormErrors).join(', ');
    formOrder.isDisableButton = true;
  } else {
    formOrder.error = '';
    formOrder.isDisableButton = false;
  }
});

events.on('basket:contacts', () => {

  const contactsData: IFormContacts = {
    email: buyerModel.email ?? '',
    phone: buyerModel.phone ?? '',
    isDisableButton: buyerModel.email === '' || buyerModel.phone === ''
  }

  console.log(contactsData)

  modal.content = formContact.render(contactsData);
  modal.open();
});

events.on('email:change', (buyer: Partial<IBuyer>) => {
  buyerModel.email = buyer.email ?? '';
});

events.on('phone:change', (buyer: Partial<IBuyer>) => {
  buyerModel.phone = buyer.phone ?? '';
})

events.on('contacts:validation', () => {

  const allErrors: TValidationErrors = buyerModel.validate();

  const contactFormErrors: TValidationErrors = {};
  if (allErrors.email) contactFormErrors.email = allErrors.email;
  if (allErrors.phone) contactFormErrors.phone = allErrors.phone;


  if (Object.keys(contactFormErrors).length > 0) {
    formContact.error = Object.values(contactFormErrors).join(', ');
    formContact.isDisableButton = true;
  } else {
    formContact.error = '';
    formContact.isDisableButton = false;
  }

});

events.on('order:send', () => {
  const orderData = createOrderData(basketModel, buyerModel);

  webLarekApi
  .createOrder(orderData) 
  .then((response) => {
    events.emit('order:success');
  })
  .catch((error) => {
    console.error("Ошибка при отправке заказа", error);
  });

});

events.on('order:success', () => {
  
  const successContainer = cloneTemplate(successTemplate);
  
  const successPage = new SuccessPage(events, successContainer);
  successPage.total = basketModel.getTotalPrice();
 
  modal.content = successPage.render();
  modal.open();

  basketModel.clear();
  buyerModel.clearData();
  
});

events.on('success:close', () => {
  modal.close();
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
