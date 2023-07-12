export class InPe {
  inItems: InItem[] = [];
}

export class InItem {
  verifyTypes: string;
  transformTypes: string;
  paramKey: string;
  value: string;
  defaultValue: string;
  must: boolean;
}

export namespace InPe {
  export const VERIFY_TYPE = {
    NUMBER: 'NUMBER_VERIFY_TYPE',
    STRING: 'STRING_VERIFY_TYPE',
    SQL_INJECT: 'SQL_INJECT_VERIFY_TYPE',
    REGULAR: 'REGULAR:',
  };

  export const TRANSFORM_TYPE = {
    BASE64DECODE: 'BASE64DECODE',
  };
}
