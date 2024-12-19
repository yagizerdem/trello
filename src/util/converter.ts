import { v4 as uuidv4 } from "uuid";

export function convertBase64toFile(base64: string): File | null {
  let uuid = uuidv4();

  function dataURLtoFile(dataurl: string, filename: string) {
    if (!dataurl) {
      return null;
    }
    var arr = dataurl.split(","),
      mime: string | undefined = arr[0].match(/:(.*?);/)?.[1],
      bstr = atob(arr[arr.length - 1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    if (!mime) {
      return null;
    }
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  var file = dataURLtoFile(base64, uuid);
  return file;
}
