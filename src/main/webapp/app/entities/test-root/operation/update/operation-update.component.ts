import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IOperation, Operation } from '../operation.model';
import { OperationService } from '../service/operation.service';
import { IBankAccountMySuffix } from 'app/entities/test-root/bank-account-my-suffix/bank-account-my-suffix.model';
import { BankAccountMySuffixService } from 'app/entities/test-root/bank-account-my-suffix/service/bank-account-my-suffix.service';
import { ILabel } from 'app/entities/test-root/label/label.model';
import { LabelService } from 'app/entities/test-root/label/service/label.service';

@Component({
  selector: 'jhi-operation-update',
  templateUrl: './operation-update.component.html',
})
export class OperationUpdateComponent implements OnInit {
  isSaving = false;

  bankAccountsSharedCollection: IBankAccountMySuffix[] = [];
  labelsSharedCollection: ILabel[] = [];

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    description: [],
    amount: [null, [Validators.required]],
    bankAccount: [],
    labels: [],
  });

  constructor(
    protected operationService: OperationService,
    protected bankAccountService: BankAccountMySuffixService,
    protected labelService: LabelService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ operation }) => {
      if (operation.id === undefined) {
        const today = dayjs().startOf('day');
        operation.date = today;
      }

      this.updateForm(operation);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const operation = this.createFromForm();
    if (operation.id !== undefined) {
      this.subscribeToSaveResponse(this.operationService.update(operation));
    } else {
      this.subscribeToSaveResponse(this.operationService.create(operation));
    }
  }

  trackBankAccountMySuffixById(index: number, item: IBankAccountMySuffix): number {
    return item.id!;
  }

  trackLabelById(index: number, item: ILabel): number {
    return item.id!;
  }

  getSelectedLabel(option: ILabel, selectedVals?: ILabel[]): ILabel {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOperation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(operation: IOperation): void {
    this.editForm.patchValue({
      id: operation.id,
      date: operation.date ? operation.date.format(DATE_TIME_FORMAT) : null,
      description: operation.description,
      amount: operation.amount,
      bankAccount: operation.bankAccount,
      labels: operation.labels,
    });

    this.bankAccountsSharedCollection = this.bankAccountService.addBankAccountMySuffixToCollectionIfMissing(
      this.bankAccountsSharedCollection,
      operation.bankAccount
    );
    this.labelsSharedCollection = this.labelService.addLabelToCollectionIfMissing(this.labelsSharedCollection, ...(operation.labels ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.bankAccountService
      .query()
      .pipe(map((res: HttpResponse<IBankAccountMySuffix[]>) => res.body ?? []))
      .pipe(
        map((bankAccounts: IBankAccountMySuffix[]) =>
          this.bankAccountService.addBankAccountMySuffixToCollectionIfMissing(bankAccounts, this.editForm.get('bankAccount')!.value)
        )
      )
      .subscribe((bankAccounts: IBankAccountMySuffix[]) => (this.bankAccountsSharedCollection = bankAccounts));

    this.labelService
      .query()
      .pipe(map((res: HttpResponse<ILabel[]>) => res.body ?? []))
      .pipe(
        map((labels: ILabel[]) => this.labelService.addLabelToCollectionIfMissing(labels, ...(this.editForm.get('labels')!.value ?? [])))
      )
      .subscribe((labels: ILabel[]) => (this.labelsSharedCollection = labels));
  }

  protected createFromForm(): IOperation {
    return {
      ...new Operation(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      description: this.editForm.get(['description'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      bankAccount: this.editForm.get(['bankAccount'])!.value,
      labels: this.editForm.get(['labels'])!.value,
    };
  }
}
