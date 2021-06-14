import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { IOperation } from 'app/entities/test-root/operation/operation.model';
import { BankAccountType } from 'app/entities/enumerations/bank-account-type.model';

export interface IBankAccountMySuffix {
  id?: number;
  name?: string;
  guid?: string | null;
  bankNumber?: number | null;
  agencyNumber?: number | null;
  lastOperationDuration?: number | null;
  meanOperationDuration?: number | null;
  meanQueueDuration?: string | null;
  balance?: number;
  openingDay?: dayjs.Dayjs | null;
  lastOperationDate?: dayjs.Dayjs | null;
  active?: boolean | null;
  accountType?: BankAccountType | null;
  attachmentContentType?: string | null;
  attachment?: string | null;
  description?: string | null;
  user?: IUser | null;
  operations?: IOperation[] | null;
}

export class BankAccountMySuffix implements IBankAccountMySuffix {
  constructor(
    public id?: number,
    public name?: string,
    public guid?: string | null,
    public bankNumber?: number | null,
    public agencyNumber?: number | null,
    public lastOperationDuration?: number | null,
    public meanOperationDuration?: number | null,
    public meanQueueDuration?: string | null,
    public balance?: number,
    public openingDay?: dayjs.Dayjs | null,
    public lastOperationDate?: dayjs.Dayjs | null,
    public active?: boolean | null,
    public accountType?: BankAccountType | null,
    public attachmentContentType?: string | null,
    public attachment?: string | null,
    public description?: string | null,
    public user?: IUser | null,
    public operations?: IOperation[] | null
  ) {
    this.active = this.active ?? false;
  }
}

export function getBankAccountMySuffixIdentifier(bankAccount: IBankAccountMySuffix): number | undefined {
  return bankAccount.id;
}
