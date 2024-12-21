import axios from "axios";
import { createEffect, createSignal } from "solid-js";
import { setProperty } from "solid-js/web";
import AppNavBar from "~/components/AppNavBar";
import RouteGuard from "~/components/RouteGuard";
import { User } from "~/entity/user";
import useWebSocket from "~/hook/useWebSocket";
import ApiResponse from "~/util/apiResponse";
import { showErrorToast } from "~/util/showToast";

export default function Chat() {
  const [allProfiles, setAllProfiles] = createSignal<Array<User>>();
  const [selectedProfileId, setSelectedProfileId] = createSignal<number | null>(
    null
  );
  const socket = useWebSocket("http://localhost:3000/ws");

  // fetch profiles
  createEffect(async () => {
    try {
      const jwt = window.localStorage.getItem("jwt");
      const response = await axios.get("/api/Users/fetchContacts", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const apiResponse: ApiResponse = response.data;

      const userProfiles: Array<User> = apiResponse.data;
      setAllProfiles(userProfiles);

      if (!apiResponse.success) {
        showErrorToast(apiResponse.errors.join("\n"));
        return;
      }
    } catch (err) {
      console.log(err);
      showErrorToast("internal server error occured");
    }
  });
  function selectProfile(profileid: number) {
    setSelectedProfileId(profileid);
  }

  return (
    <RouteGuard>
      <div class="w-screen h-screen flex flex-col">
        <AppNavBar />
        <div class="grid grid-cols-12 w-screen h-screen">
          <div class="lg:col-span-3 col-span-4 bg-gradient-to-r from-blue-500 to-blue-800 text-white flex flex-col overflow-y-scroll ">
            {allProfiles()?.length &&
              allProfiles()?.map((profile: User) => {
                return (
                  <a
                    href="#"
                    class="cursor-pointer block max-w-sm my-2 mx-auto p-6  border w-10/12 border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                    onclick={() => selectProfile(profile.id)}
                    style={{
                      "background-color":
                        selectedProfileId() === profile.id
                          ? "#8c92ac "
                          : "white",
                    }}
                  >
                    <img
                      src={`http://localhost:3000/src/uploads/profileImages/${profile.profileImageUrl}`}
                      style="width:100px;height:100px;box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;"
                      class="object-fill mx-auto rounded-md"
                    />
                    <p class="font-normal text-gray-700 dark:text-gray-400 text-center mt-3">
                      {profile.firstName} {profile.lastName}
                    </p>
                  </a>
                );
              })}
          </div>

          <div
            class="lg:col-span-9 col-span-8 bg-gray-400 flex items-center justify-center"
            style="background-image: url('./assets/chatbackground.jpeg');"
          ></div>
        </div>
      </div>
    </RouteGuard>
  );
}
