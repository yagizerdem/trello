import { useNavigate } from "@solidjs/router";
import axios from "axios";
import { useAuth } from "~/context/authContext";
import LogInDTO from "~/DTO/logInDTO";
import SD from "~/SD";
import ApiResponse from "~/util/apiResponse";
import { showErrorToast, showSuccessToast } from "~/util/showToast";
export default function LogIn() {
  const navigate = useNavigate();
  const auth = useAuth();
  async function login(e: Event) {
    e.preventDefault();
    const formData = Object.fromEntries(
      new FormData(e.target as HTMLFormElement).entries()
    );
    const loginDto: LogInDTO = new LogInDTO();
    Object.assign(loginDto, formData);
    console.log(loginDto);

    try {
      const { data } = await axios.post("/api/login", loginDto, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      var response: ApiResponse = ApiResponse.fromJSON(data);
      if (!response.success) {
        const errorMessage = response.errors.join("\n");
        showErrorToast(errorMessage);
      } else {
        showSuccessToast(response.message ?? "operation successfull");
        const jwtToken = response.data;
        localStorage.setItem(SD.localStorageKeys.jwt, jwtToken);
        auth?.login();
        navigate("/Home");
      }
    } catch (err) {
      console.log(err);
    }
  }

  function gotoRegister() {
    navigate("/Auth/register", { replace: false });
  }

  return (
    <div class="w-screen h-screen  bg-gradient-to-r from-blue-400 to-blue-700 ">
      <div class="w-screen h-screen  bg-gradient-to-r from-blue-400 to-blue-700 ">
        <div class="h-fit w-fit p-10 pb-3 bg-white absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-2xl">
          <form enctype="multipart/form-data" onsubmit={login}>
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

            <button type="submit" class="btn btn-primary mb-3">
              Submit
            </button>
          </form>
          <p class="text-blue-500  mt-1 cursor-pointer " onclick={gotoRegister}>
            if you dont have account go to register
          </p>
        </div>
      </div>
    </div>
  );
}
