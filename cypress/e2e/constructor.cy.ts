export const testURL = 'http://localhost:4000/';

const selectors = {
  constructorBunTop: '[data-testid="constructor-bun-top"]',
  constructorIngredients: '[data-testid="constructor-ingredients"]',
  orderButton: '[data-testid="order-button"]',
  modal: '[data-testid="modal"]',
  modalClose: '[data-testid="modal-close"]'
};

describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    // Мокаем запрос ингредиентов
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit(testURL);
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('добавление булки в конструктор', () => {
      cy.contains('Краторная булка N-200i').parent().find('button').click();

      cy.get(selectors.constructorBunTop)
        .should('contain.text', 'Краторная булка N-200i')
        .should('not.contain.text', 'Выберите булки');
    });

    it('добавление ингредиентов в конструктор', () => {
      cy.contains('Краторная булка N-200i').parent().find('button').click();

      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .click();

      cy.get(selectors.constructorIngredients)
        .should('contain.text', 'Биокотлета')
        .should('not.contain.text', 'Выберите начинку');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('открытие и закрытие модального окна ингредиента', () => {
      cy.contains('Краторная булка N-200i').click();

      // Ищем модальное окно в любом месте DOM
      cy.get(selectors.modal, { timeout: 5000 }).should('be.visible');
      cy.get(selectors.modalClose).click();
      cy.get(selectors.modal).should('not.exist');
    });

    it('отображение правильного ингредиента в модальном окне', () => {
      cy.contains('Краторная булка N-200i').click();

      cy.get(selectors.modal).should('contain.text', 'Краторная булка N-200i');
      cy.get(selectors.modal).should('contain.text', '420');
      cy.get(selectors.modal).should('contain.text', '80');
      cy.get(selectors.modal).should('contain.text', '53');
    });
  });

  describe('Создание заказа', () => {
    it('Редирект на страницу логина', () => {
      cy.contains('Краторная булка N-200i').parent().find('button').click();

      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .click();

      cy.get(selectors.orderButton).click();
      cy.url().should('include', '/login');
    });

    it('Создание заказа после авторизации', () => {
      // Мокаем пользователя
      cy.intercept('GET', '**/api/auth/user', {
        statusCode: 200,
        body: {
          success: true,
          user: { email: 'test@test.com', name: 'Test User' }
        }
      }).as('getUser');

      cy.setCookie('accessToken', 'mock-access-token');
      cy.intercept('POST', '**/api/orders', {
        fixture: 'order.json'
      }).as('createOrder');

      cy.reload();
      cy.wait('@getUser');

      // Добавляем ингредиенты
      cy.contains('Краторная булка N-200i').parent().find('button').click();

      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .click();

      // Создаем заказ
      cy.get(selectors.orderButton).click();
      cy.wait('@createOrder');

      // Ждем модальное окно заказа
      cy.contains('12345', { timeout: 10000 }).should('be.visible');
      cy.contains('идентификатор заказа').should('be.visible');
      cy.contains('Ваш заказ начали готовить').should('be.visible');

      // Закрываем модальное окно
      cy.get(selectors.modalClose).click();

      // Ждем исчезновения модального окна
      cy.contains('12345').should('not.exist');

      // Проверяем очистку конструктора
      cy.get(selectors.constructorIngredients)
        .should('contain.text', 'Выберите начинку')
        .should('not.contain.text', 'Биокотлета');

      cy.get(selectors.constructorBunTop)
        .should('contain.text', 'Выберите булки')
        .should('not.contain.text', 'Краторная булка');
    });
  });
});
