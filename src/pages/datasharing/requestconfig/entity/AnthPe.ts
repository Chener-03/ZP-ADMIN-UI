
export class AuthPe {
  authItems: AuthItem[] = [];
}

export class AuthItem {
  authType: string;
  paramKeys: string[] = [];
  md5Slat: string;
  md5ParamKey: string;
  ips: string[] = [];
  heads: string;
}


export namespace AuthPe {
  export const AUTH_TYPE = {
    MD5: 'md5_xyz.chener.zp.datasharing.requestProcess.entity.pe.AuthPe',
    IP: 'ip_xyz.chener.zp.datasharing.requestProcess.entity.pe.AuthPe',
    HEAD: 'head_xyz.chener.zp.datasharing.requestProcess.entity.pe.AuthPe',
  };
}



