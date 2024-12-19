import { useNavigate } from "@solidjs/router";
import ImageProcessing from "~/components/ImageProcessing";
import { createEffect, createMemo, createSignal } from "solid-js";
import blankProfile from "../../../public/assets/blank-profile-picture-973460_1280.webp";
import SD from "~/SD";
import container from "~/diContainer";
import RegisterDTO from "~/DTO/registerDTO";
import ValidationResponse from "~/util/validationResponse";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "~/util/showToast";
import axios from "axios";
import { convertBase64toFile } from "~/util/converter";
import ApiResponse from "~/util/apiResponse";
import Loader from "~/components/loader";

export default function Register() {
  const [imgProcessingActive, setimgProcessingActive] = createSignal(false);
  const [profileBase64, setprofileBase64] = createSignal<string>("");
  const [isLoading, setIsLoading] = createSignal(false);
  const derivedProfileImage = createMemo(() =>
    profileBase64().trim() == "" ? blankProfile : profileBase64()
  );

  const navigate = useNavigate();
  async function register(e: Event) {
    e.preventDefault();
    const formData = Object.fromEntries(
      new FormData(e.target as HTMLFormElement).entries()
    );

    const file: File | null = convertBase64toFile(profileBase64());

    const registerDto: RegisterDTO = new RegisterDTO();
    Object.assign(registerDto, formData);
    registerDto["profile"] = file;

    // registerDto.firstName = "yagiz";
    // registerDto.lastName = "erdem";
    // registerDto.email = "yagizerdem@gmail.com";
    // registerDto.password = "123456aA!";

    const validate: ValidationResponse = registerDto.isValid();

    if (!validate.success) {
      showErrorToast(validate.errors.join("\n"));
      return;
    }

    try {
      const { data } = await axios.post("/api/register", registerDto, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      var response: ApiResponse = ApiResponse.fromJSON(data);
      if (!response.success) {
        const errorMessage = response.errors.join("\n");
        showErrorToast(errorMessage);
      } else {
        showSuccessToast(response.message ?? "operation successfull");
        setTimeout(() => {
          showSuccessToast("redirecting to log in page");
          gotoLogIn();
        }, 500);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }
  function gotoLogIn() {
    navigate("/Auth/login", { replace: false });
  }
  function handleImage(e: Event) {
    const input = e.target as HTMLInputElement;
    const proifleImage: File | null = input.files?.[0] || null;
    if (proifleImage == null) {
      return;
    }
    // covner to binary
    const r: FileReader = new FileReader();
    r.readAsDataURL(proifleImage);

    r.onload = function (readerEvent) {
      const base64 = readerEvent.target?.result as string;
      setprofileBase64(base64);
    };
    input.value = "";
  }

  return (
    <>
      <div class=" w-screen h-screen  bg-gradient-to-r from-blue-400 to-blue-700 ">
        <div class="h-fit w-fit p-10 pb-3 bg-white absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-2xl ">
          <div class="relative">
            <img
              width="100"
              height="100"
              src={derivedProfileImage()}
              class="mx-auto my-4 border-black border-4 rounded-lg"
              style="box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;"
            ></img>

            <button
              class="w-8 h-8 rounded-full bg-slate-400 absolute top-0 left-20 flex justify-center items-center"
              onclick={() => {
                setprofileBase64("");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                width="16"
                class="inline"
              >
                <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
              </svg>
            </button>

            <button
              class="w-8 h-8 rounded-full bg-slate-400 absolute top-10 left-20 flex justify-center items-center"
              onclick={() => setimgProcessingActive(true)}
            >
              <svg
                width="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
              </svg>
            </button>
          </div>
          <form enctype="multipart/form-data" onsubmit={register}>
            <div class="form-group">
              <label for="exampleInputEmail1">Email address</label>
              <input
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                name="email"
              />
              <small id="emailHelp" class="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                class="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
                name="password"
              />
            </div>

            <div class="form-group">
              <label for="firstName">first name</label>
              <input
                type="text"
                class="form-control"
                id="firstName"
                placeholder="enter first name"
                name="firstName"
              />
            </div>

            <div class="form-group">
              <label for="lastName">last name</label>
              <input
                type="text"
                class="form-control"
                id="lastName"
                placeholder="enter last name"
                name="lastName"
              />
            </div>
            <br />
            <label for="profile" class="block cursor-pointer">
              select profile photo
            </label>
            <input
              type="file"
              accept="image/*"
              id="profile"
              name="profile"
              class="cursor-pointer"
              onchange={handleImage}
            ></input>
            <br />
            <button type="submit" class="btn btn-primary mb-3 mt-4">
              Submit
            </button>
          </form>
          <p class="text-blue-500  mt-1 cursor-pointer " onclick={gotoLogIn}>
            if you already have account go to login
          </p>
        </div>
        {isLoading() && (
          <div class="relative inset-0 bg-black opacity-5   flex items-center justify-center w-screen h-screen">
            <Loader color="red" />
          </div>
        )}
      </div>

      {imgProcessingActive() && (
        <ImageProcessing
          goBack={() => {
            setimgProcessingActive(false);
          }}
          setImage={(data: string) => setprofileBase64(data)}
          imgFileBase64={derivedProfileImage()}
        />
      )}
    </>
  );
}
