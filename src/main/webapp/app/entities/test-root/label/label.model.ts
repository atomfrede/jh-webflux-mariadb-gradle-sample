import { IOperation } from 'app/entities/test-root/operation/operation.model';

export interface ILabel {
  id?: number;
  labelName?: string;
  operations?: IOperation[] | null;
}

export class Label implements ILabel {
  constructor(public id?: number, public labelName?: string, public operations?: IOperation[] | null) {}
}

export function getLabelIdentifier(label: ILabel): number | undefined {
  return label.id;
}
