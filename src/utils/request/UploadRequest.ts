import axios from "axios";


export class UploadRequest{
  static uploadMinio = uploadMinio
}

async function uploadMinio(url: string, file: File): Promise<boolean> {
  try {
    let resp = await axios.put(url, file,{
      headers: {
        'Content-Type': 'application/octet-stream',
      }
    })
    if (resp.status === 200){
      return true
    }
  }catch (err){ }
  return false
}
