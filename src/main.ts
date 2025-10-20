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
import { FormOrder } from "./components/Views/form/FormOrder.ts";
import { FormContact } from "./components/Views/form/FormContact.ts";
import { SuccessPage } from "./components/Views/SuccessPage.ts";

const baseApi = new Api(API_URL);
const events = new EventEmitter();
const catalogModel = new Catalog(events);

const BasketModel = new Basket(events);
const buyerModel = new Buyer(events);

const pageElement = document.querySelector('.page') as HTMLElement;
const gallery = new Gallery(events, pageElement);

const headerElement = document.querySelector('.header') as HTMLElement; 
const header = new Header(events, headerElement);

const modalElement = document.querySelector('.modal') as HTMLElement;
const modal = new Modal(events, modalElement);

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
        events.emit('basket:open'); 
      }
    });
    return card.render(item);
  });

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
        modal.close();
      } else {
        events.emit('basket:add', product);
        modal.close();
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
});

events.on('basket:order', () => {
  const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
  const orderContainer = cloneTemplate(orderTemplate);

  const formOrder = new FormOrder(orderContainer, {
     setPayment: () => {
      const selectedButtonPayment = ensureElement<HTMLButtonElement>('.button_alt-active', orderContainer);

      if (selectedButtonPayment.name) {
        const buyer: Partial<IBuyer> = {payment: selectedButtonPayment.name as TPayment}
        events.emit('payment: change', buyer);
        events.emit('order:validation', formOrder);
      }
      
     },
     setAddress: () => {
      const inputAddress = ensureElement<HTMLInputElement>('input[name="address"]', orderContainer);
      buyerModel.address = inputAddress.value;
      const buyer: Partial<IBuyer> = {address: inputAddress.value}
      events.emit('address: change', buyer);
      events.emit('order:validation', formOrder);
     },
     onSubmit: (event) => { 
      event.preventDefault(); 
      events.emit('basket:contacts');
  },
  });

  modal.content = formOrder.render();
  modal.open();
});

events.on('address: change', (buyer: Partial<IBuyer>) => {
  buyerModel.address = buyer.address ?? '';
  
})

events.on('payment: change', (buyer: Partial<IBuyer>) => {
  if (buyer.payment) {
    buyerModel.payment = buyer.payment;
  }
})

events.on('order:validation', (formOrder: FormOrder) => {
 
  const allErrors: TValidationErrors = buyerModel.validate();

  const orderFormErrors: TValidationErrors = {};
  if (allErrors.payment) orderFormErrors.payment = allErrors.payment;
  if (allErrors.address) orderFormErrors.address = allErrors.address;


  if (Object.keys(orderFormErrors).length > 0) {
    formOrder.error = Object.values(orderFormErrors).join(', ');
    formOrder.setDisableButton(true);
  } else {
    formOrder.error = '';
    formOrder.setDisableButton(false);
  }
});

events.on('basket:contacts', () => {
  const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
  const contactsContainer = cloneTemplate(contactsTemplate);
  
  const formContact = new FormContact(contactsContainer, {
    setEmail: () => {
      const emailInput = ensureElement<HTMLInputElement>('input[name="email"]', contactsContainer);
      const emailValue = emailInput.value;
      const buyer: Partial<IBuyer> = {email: emailValue}
      events.emit('email: change', buyer);
      events.emit('contacts:validation', formContact);
    },
    setPhone: () => {
      const phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', contactsContainer);
      const phoneValue = phoneInput.value;
      const buyer: Partial<IBuyer> = {phone: phoneValue}
      events.emit('phone: change', buyer);
      events.emit('contacts:validation', formContact);
    },

    onSubmit: (event) => {
      event.preventDefault(); 
      events.emit('order: send');
    },

  });

  modal.content = formContact.render();
  modal.open();
});

events.on('email: change', (buyer: Partial<IBuyer>) => {
  buyerModel.email = buyer.email ?? '';
});

events.on('phone: change', (buyer: Partial<IBuyer>) => {
  buyerModel.phone = buyer.phone ?? '';
})


events.on('contacts:validation', (formContact: FormContact) => {

  const allErrors: TValidationErrors = buyerModel.validate();
  console.log(allErrors);

  const contactFormErrors: TValidationErrors = {};
  if (allErrors.email) contactFormErrors.email = allErrors.email;
  if (allErrors.phone) contactFormErrors.phone = allErrors.phone;


  if (Object.keys(contactFormErrors).length > 0) {
    formContact.error = Object.values(contactFormErrors).join(', ');
    formContact.setDisableButton(true);
  } else {
    formContact.error = '';
    formContact.setDisableButton(false);
  }

});

events.on('order: send', () => {
  const orderData = createOrderData(BasketModel, buyerModel);

  webLarekApi
  .createOrder(orderData) 
  .then((response) => {
    events.emit('order: success');
  })
  .catch((error) => {
    console.error("Ошибка при отправке заказа", error);
  });

});

events.on('order: success', () => {
  const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
  const successContainer = cloneTemplate(successTemplate);
  
  const successPage = new SuccessPage(events, successContainer);
  successPage.total = BasketModel.getTotalPrice();
 
  modal.content = successPage.render();
  modal.open();

  BasketModel.clear();
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
