import axios from "axios";
import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  onMount,
} from "solid-js";
import { memo, setProperty } from "solid-js/web";
import AppNavBar from "~/components/AppNavBar";
import RouteGuard from "~/components/RouteGuard";
import { User } from "~/entity/user";
import { useDebounce } from "~/hook/useDebounde";
import useWebSocket from "~/hook/useWebSocket";
import ApiResponse from "~/util/apiResponse";
import { showErrorToast } from "~/util/showToast";

export default function Chat() {
  // data and refs
  const [allProfiles, setAllProfiles] = createSignal<Array<User>>();
  const [selectedProfileId, setSelectedProfileId] = createSignal<number | null>(
    null
  );
  const selectedProfile = createMemo(() =>
    allProfiles()?.find((p: User) => p.id == selectedProfileId())
  );
  const socket = useWebSocket("http://localhost:3000/ws");
  let inputRef;
  const [isWriting, setIsWriting] = createSignal(false);
  const debouncedValue = useDebounce(isWriting, 500);
  //

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
  // initlize component
  onMount(() => socket.connect());

  // listen selected profile changes
  createEffect(() => {
    if (socket.isConnected() && selectedProfile()) {
      socket.sendMessage(
        JSON.stringify({
          type: "isprofileactive",
          userid: selectedProfile()?.id,
        })
      );

      socket.sendMessage(
        JSON.stringify({
          type: "settargetprofile",
          userid: selectedProfile()?.id,
        })
      );

      // refresh messages
      socket.setMessages([]);
    }
  });

  // callback from html dom
  function selectProfile(profileid: number) {
    setSelectedProfileId(profileid);
  }

  // send caht
  function onSendChat() {
    //@ts-ignore
    const text = inputRef.value;
    socket.sendMessage(JSON.stringify({ type: "newmessage", message: text }));
  }

  function ontyping() {
    setIsWriting(true);
  }
  function onblur() {
    setIsWriting(false);
  }

  createEffect(() => {
    const flag: boolean = debouncedValue();
    socket.sendMessage(JSON.stringify({ type: "iswriting", flag: flag }));
  });

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
            class="lg:col-span-9 col-span-8  flex  flex-col overflow-y-hidden"
            style="background-image: url('./assets/chatbackground.jpeg');"
          >
            {selectedProfile() && (
              <>
                <div class="w-full relative" style="height: 80px;">
                  <div
                    class="absolute top-0 left-0 w-full h-full bg-slate-300 opacity-50 z-10"
                    style="box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;"
                  ></div>
                  <div class="absolute top-0 left-0 w-full h-full   z-20 flex items-center ">
                    <img
                      src={`http://localhost:3000/src/uploads/profileImages/${
                        selectedProfile()?.profileImageUrl
                      }`}
                      class="rounded-full mx-4"
                      style="width:70px;height:70px;"
                    ></img>
                    <div class="font-bold">
                      {selectedProfile()?.firstName}{" "}
                      {selectedProfile()?.lastName}
                    </div>
                    <div class="mx-2">
                      <ActiveComponent isActive={socket.profileActive()} />
                    </div>
                    <div>
                      {socket.isTargetWriting() && <span>writing ...</span>}
                    </div>
                  </div>
                </div>
                <div
                  class="flex-1 flex-col flex mx-10 my-10 overflow-hidden"
                  style="box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;"
                >
                  <ul class="mx-10 my-10 overflow-y-auto">
                    <For each={socket.messages()}>
                      {(item, index) => (
                        <div
                          class="lg:w-11/12 mx-auto w-8/12 bg-white text-left font-bold text-lg my-2 py-2 px-1 rounded-md"
                          style="box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;"
                        >
                          {item}
                        </div>
                      )}
                    </For>
                  </ul>
                </div>

                <div class="w-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700  grid grid-cols-12 p-4">
                  <input
                    type="text"
                    class="col-span-7 rounded-md p-1 mr-10 min-w-44"
                    placeholder="you can chat"
                    ref={inputRef}
                    oninput={ontyping}
                    onblur={onblur}
                  ></input>
                  <button
                    type="button"
                    class="btn btn-success col-span-3 min-w-32 "
                    onclick={onSendChat}
                  >
                    Send Chat
                  </button>
                </div>
              </>
            )}
            {!selectedProfile() && (
              <>
                <div class="mx-auto flex items-center h-full w-full justify-center align-middle font-bold text-xl">
                  select profile to chat
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}

interface ActiveComponentProps {
  isActive: boolean; // Define the type for the isActive prop
}

const ActiveComponent: Component<ActiveComponentProps> = (props) => {
  const color = createMemo(() => (props.isActive ? "green" : "black"));
  return (
    <div class="flex flex-row items-center align-middle justify-center ">
      <div
        class="rounded-full mr-1 ml-2"
        style={`width:10px;height:10px;background-color:${color()}`}
      ></div>
      {props.isActive && <span>active</span>}
      {!props.isActive && <span>not active </span>}
    </div>
  );
};
