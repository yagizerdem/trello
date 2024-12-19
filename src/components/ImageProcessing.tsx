import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { onMount, createSignal } from "solid-js";
import placeHolderImage from "../../public/assets/800x600.png";

interface IImageProcessDto {
  goBack: Function;
  setImage: Function;
  imgFileBase64: string;
}

export default function ImageProcessing(attrs: IImageProcessDto) {
  let imageRef!: HTMLImageElement;
  let cropper: Cropper;

  onMount(() => {
    cropper = new Cropper(imageRef, {
      aspectRatio: NaN, // Set cropping ratio
      crop(event) {
        console.log(event.detail.x, event.detail.y); // Log crop coordinates
      },
    });
  });

  const getCroppedImage = () => {
    const canvas = cropper.getCroppedCanvas();
    const resultBase64: string = canvas.toDataURL("image/png");
    attrs.setImage(resultBase64);
    attrs.goBack();
  };

  return (
    <div class="w-full h-full opacity-85 bg-black absolute top-0 left-0 z-20">
      <div class="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2">
        <div>
          <img ref={imageRef} src={attrs.imgFileBase64} alt="Source" />
        </div>
        <button
          type="button"
          class="btn btn-primary mt-3"
          onClick={getCroppedImage}
        >
          Crop Image
        </button>
        <button
          type="button"
          class="btn btn-danger mt-3 mx-3 w-fit flex"
          onclick={() => attrs.goBack()}
        >
          <span class="inline mx-2">Discard</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            width="16"
            class="inline"
          >
            <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
          </svg>
        </button>
      </div>
      <button
        class="absolute top-0 right-0 rounded-full p-6 m-10 bg-white shadow-md"
        onclick={() => {
          attrs.goBack();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          width="24"
          height="24"
          fill="black"
          aria-label="Arrow Icon"
        >
          <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
        </svg>
      </button>
    </div>
  );
}
