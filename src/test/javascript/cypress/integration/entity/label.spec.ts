import { entityItemSelector } from '../../support/commands';
import { entityTableSelector, entityDetailsButtonSelector, entityDetailsBackButtonSelector } from '../../support/entity';

describe('Label e2e test', () => {
  const labelPageUrl = '/label';
  const labelPageUrlPattern = new RegExp('/label(\\?.*)?$');
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
    cy.intercept('GET', '/api/labels+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/labels').as('postEntityRequest');
    cy.intercept('DELETE', '/api/labels/*').as('deleteEntityRequest');
  });

  it('should load Labels', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('label');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Label').should('exist');
    cy.url().should('match', labelPageUrlPattern);
  });

  it('should load details Label page', function () {
    cy.visit(labelPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityDetailsButtonSelector).first().click({ force: true });
    cy.getEntityDetailsHeading('label');
    cy.get(entityDetailsBackButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', labelPageUrlPattern);
  });
});
