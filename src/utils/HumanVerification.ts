//@ts-nocheck
import {MessagePlugin} from "tdesign-vue-next";

const googlePrivateKey = '6LfSuiUiAAAAAM4N4hjEAnaHL6vQi1eGCRgqXvmf';

export const getVerificationCode = async ()=>{
  return new Promise((resolve, reject)=>{
    window.grecaptcha.ready(()=>{
      window.grecaptcha.execute(googlePrivateKey,{action: 'submit'})
        .then((token: string) => {
          resolve(token);
        }).catch(err=>{
        MessagePlugin.error('人机验证失败');
        reject('人机验证失败');
      })
    })
  })
}


