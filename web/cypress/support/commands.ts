/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      log(message: string, ...args: unknown[]): Chainable<void>;
    }
  }
}

export {};
