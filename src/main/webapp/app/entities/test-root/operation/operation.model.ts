import * as dayjs from 'dayjs';
import { IBankAccountMySuffix } from 'app/entities/test-root/bank-account-my-suffix/bank-account-my-suffix.model';
import { ILabel } from 'app/entities/test-root/label/label.model';

export interface IOperation {
  id?: number;
  date?: dayjs.Dayjs;
  description?: string | null;
  amount?: number;
  bankAccount?: IBankAccountMySuffix | null;
  labels?: ILabel[] | null;
}

export class Operation implements IOperation {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs,
    public description?: string | null,
    public amount?: number,
    public bankAccount?: IBankAccountMySuffix | null,
    public labels?: ILabel[] | null
  ) {}
}

export function getOperationIdentifier(operation: IOperation): number | undefined {
  return operation.id;
}
