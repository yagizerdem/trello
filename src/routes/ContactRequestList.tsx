import axios from "axios";
import { createEffect, createSignal, Show } from "solid-js";
import AppNavBar from "~/components/AppNavBar";
import Loader from "~/components/loader";
import RouteGuard from "~/components/RouteGuard";
import { useApp } from "~/context/appContext";
import { ContactRequest } from "~/entity/contactRequest";
import ApiResponse from "~/util/apiResponse";
import { showErrorToast, showSuccessToast } from "~/util/showToast";

export default function ContactRequestList() {
  const [contactRequestList, setContactRequestList] =
    createSignal<Array<any>>();
  const appContext = useApp();

  const [isLoading, setIsLoading] = createSignal(false);

  async function accept(userid: number) {
    try {
      const jwt = localStorage.getItem("jwt");
      const response = await axios.post(
        "/api/Users/processContactRequest",
        { destUserId: userid, approved: true },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      const apiResponse: ApiResponse = response.data;
      console.log(apiResponse);
      if (!apiResponse.success) {
        showErrorToast(apiResponse.errors.join("\n"));
      } else {
        showSuccessToast(apiResponse.message);

        setContactRequestList((prev) =>
          prev?.filter(
            (item) =>
              item.fromuserId == appContext?.userid() &&
              item.destuserId == userid
          )
        );
      }
    } catch (err) {
      console.log(err);
      showErrorToast("something went wrong");
    }
  }
  async function reject(userid: number) {
    try {
      const jwt = localStorage.getItem("jwt");
      const response = await axios.post(
        "/api/Users/processContactRequest",
        { destUserId: userid, approved: false },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      const apiResponse: ApiResponse = response.data;
      console.log(apiResponse);
      if (!apiResponse.success) {
        showErrorToast(apiResponse.errors.join("\n"));
      } else {
        showSuccessToast(apiResponse.message);

        setContactRequestList((prev) =>
          prev?.filter(
            (item) =>
              item.fromuserId == appContext?.userid() &&
              item.destuserId == userid
          )
        );
      }
    } catch (err) {
      console.log(err);
      showErrorToast("something went wrong");
    }
  }

  createEffect(() => {
    async function helper() {
      try {
        setIsLoading(true);
        const jwt = window.localStorage.getItem("jwt");
        const result = await axios.get("/api/Users/contactRequest", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const apiResponse: ApiResponse = result.data;
        if (!apiResponse.success) {
          showErrorToast(apiResponse.errors.join("\n"));
          return;
        }
        const l: Array<any> = apiResponse.data;
        for (var i = 0; i < 10; i++) {
          const l: Array<any> = apiResponse.data;

          // Update the signal state
          setContactRequestList(l);
        }
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    }
    helper();
  });

  return (
    <RouteGuard>
      <AppNavBar></AppNavBar>
      <Show when={isLoading()}>
        <div class="flex items-center w-full h-fit  justify-center my-5">
          <Loader color="red" />
        </div>
      </Show>

      <div class="lg:w-9/12 flex flex-wrap mx-auto items-center justify-center">
        {contactRequestList()?.map((item) => {
          return (
            <>
              <div class="card m-5" style="width: 18rem;">
                <img
                  class="card-img-top mx-auto block my-1 rounded-md"
                  src={`http://localhost:3000/src/uploads/profileImages/${item.profileImageUrl}`}
                  alt="Card image cap"
                  style="width:150px; height:150px;object-fit: contains;"
                />
                <div class="card-body">
                  <h5 class="card-title mx-auto block text-center">
                    {item.firstName} {item.lastName}
                  </h5>
                  <p class="card-text text-center">{item.email}</p>
                  <div class="flex justify-between items-center flex-grow">
                    <button
                      type="button"
                      class="btn btn-success"
                      onclick={() => accept(item.id)}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger"
                      onclick={() => reject(item.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </RouteGuard>
  );
}
