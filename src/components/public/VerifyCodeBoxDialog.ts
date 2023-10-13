import {createApp, ref} from 'vue'
import VerifyCodeBoxDialog from "@/components/public/VerifyCodeBoxDialog.vue";
import TDesign from "tdesign-vue-next";


const CreateDialog = () => {

  return new Promise<string>((resolve, reject)=>{
    const mountNode = document.createElement('div')
    const code = ref('')
    const Instance = createApp(VerifyCodeBoxDialog, {
      show: true,
      code:code,
      close: () => {
        Instance.unmount();
        document.body.removeChild(mountNode);
        resolve(code.value);
      }
    })
    document.body.appendChild(mountNode)
    Instance.use(TDesign)
    Instance.mount(mountNode)
  })

}

export default CreateDialog
