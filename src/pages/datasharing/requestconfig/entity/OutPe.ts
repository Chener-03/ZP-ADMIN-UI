export class OutPe {
  outItems: OutItem[] = [];
}

export class OutItem {
  fomatterType: string;
  fomatterExp: string;
  transformTypes: string;
  paramKey: string;
  showKey: string;
  value: string;
  defaultValue: string;
}

export namespace OutPe {
  export const FORMAT_TYPE = {
    TIME: 'TIME',
  };

  export const TRANSFORM_TYPE = {
    BASE64ENCODE: 'BASE64ENCODE',
    ANTIANAPHYLAXIS: 'antianaphylaxis',
  };
}
