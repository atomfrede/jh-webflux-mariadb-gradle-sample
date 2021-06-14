import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'operation',
        data: { pageTitle: 'sampleWebfluxMariaApp.testRootOperation.home.title' },
        loadChildren: () => import('./test-root/operation/operation.module').then(m => m.OperationModule),
      },
      {
        path: 'bank-account-my-suffix',
        data: { pageTitle: 'sampleWebfluxMariaApp.testRootBankAccount.home.title' },
        loadChildren: () =>
          import('./test-root/bank-account-my-suffix/bank-account-my-suffix.module').then(m => m.BankAccountMySuffixModule),
      },
      {
        path: 'label',
        data: { pageTitle: 'sampleWebfluxMariaApp.testRootLabel.home.title' },
        loadChildren: () => import('./test-root/label/label.module').then(m => m.LabelModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
