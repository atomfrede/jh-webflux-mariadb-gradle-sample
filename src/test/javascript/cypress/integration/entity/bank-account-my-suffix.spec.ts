import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('BankAccount e2e test', () => {
  const bankAccountPageUrl = '/bank-account-my-suffix';
  const bankAccountPageUrlPattern = new RegExp('/bank-account-my-suffix(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/bank-accounts+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/bank-accounts').as('postEntityRequest');
    cy.intercept('DELETE', '/api/bank-accounts/*').as('deleteEntityRequest');
  });

  it('should load BankAccounts', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('bank-account-my-suffix');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('BankAccount').should('exist');
    cy.url().should('match', bankAccountPageUrlPattern);
  });

  it('should load details BankAccount page', function () {
    cy.visit(bankAccountPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityDetailsButtonSelector).first().click({ force: true });
    cy.getEntityDetailsHeading('bankAccount');
    cy.get(entityDetailsBackButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', bankAccountPageUrlPattern);
  });

  it('should load create BankAccount page', () => {
    cy.visit(bankAccountPageUrl);
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('BankAccount');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', bankAccountPageUrlPattern);
  });

  it('should load edit BankAccount page', function () {
    cy.visit(bankAccountPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityEditButtonSelector).first().click({ force: true });
    cy.getEntityCreateUpdateHeading('BankAccount');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', bankAccountPageUrlPattern);
  });

  it('should create an instance of BankAccount', () => {
    cy.visit(bankAccountPageUrl);
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('BankAccount');

    cy.get(`[data-cy="name"]`).type('Account indigo applications').should('have.value', 'Account indigo applications');

    cy.get(`[data-cy="guid"]`)
      .type('993ed631-bba5-4d3e-a783-06f4db99cfa9')
      .invoke('val')
      .should('match', new RegExp('993ed631-bba5-4d3e-a783-06f4db99cfa9'));

    cy.get(`[data-cy="bankNumber"]`).type('84755').should('have.value', '84755');

    cy.get(`[data-cy="agencyNumber"]`).type('30190').should('have.value', '30190');

    cy.get(`[data-cy="lastOperationDuration"]`).type('59733').should('have.value', '59733');

    cy.get(`[data-cy="meanOperationDuration"]`).type('82678').should('have.value', '82678');

    cy.get(`[data-cy="meanQueueDuration"]`).type('PT29M').should('have.value', 'PT29M');

    cy.get(`[data-cy="balance"]`).type('65322').should('have.value', '65322');

    cy.get(`[data-cy="openingDay"]`).type('2020-08-04').should('have.value', '2020-08-04');

    cy.get(`[data-cy="lastOperationDate"]`).type('2020-08-04T01:34').should('have.value', '2020-08-04T01:34');

    cy.get(`[data-cy="active"]`).should('not.be.checked');
    cy.get(`[data-cy="active"]`).click().should('be.checked');

    cy.get(`[data-cy="accountType"]`).select('LOAN');

    cy.setFieldImageAsBytesOfEntity('attachment', 'integration-test.png', 'image/png');

    cy.get(`[data-cy="description"]`)
      .type('../fake-data/blob/hipster.txt')
      .invoke('val')
      .should('match', new RegExp('../fake-data/blob/hipster.txt'));

    cy.setFieldSelectToLastOfEntity('user');

    // since cypress clicks submit too fast before the blob fields are validated
    cy.wait(200); // eslint-disable-line cypress/no-unnecessary-waiting
    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.wait('@postEntityRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(201);
    });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', bankAccountPageUrlPattern);
  });

  it('should delete last instance of BankAccount', function () {
    cy.visit(bankAccountPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', response.body.length);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('bankAccount').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bankAccountPageUrlPattern);
      } else {
        this.skip();
      }
    });
  });
});
