import { useAuth } from "~/context/authContext";
import trelloLogo from "../../public/assets/trelloLogo.png";
import SD from "~/SD";
import { useNavigate } from "@solidjs/router";
import { effect } from "solid-js/web";
import axios from "axios";
import { useApp } from "~/context/appContext";
import { createEffect, createMemo } from "solid-js";
import SearchUser from "~/routes/SearchUser";
export default function AppNavBar() {
  const navigate = useNavigate();
  const appContext = useApp();
  const authContext = useAuth();
  const porfileImg = createMemo(() => {
    if (String(appContext?.profileImgUrl()).trim().length == 0) {
      return "./assets/blank-profile-picture-973460_1280.webp";
    }
    return appContext?.profileImgUrl();
  });

  function logout() {
    window.localStorage.removeItem(SD.localStorageKeys.jwt);
    authContext?.logout();
    // ensuer auth state is refreshed
    window.location.reload();
  }
  function goToHome() {
    navigate("/Home");
  }
  function goToProfile() {
    navigate(`/Profile?userId=${appContext?.userid()}`);
  }
  function goToSearchUser() {
    navigate("/SearchUser");
  }

  function goToContactRequestList() {
    navigate("/ContactRequestList");
  }

  function goToChat() {
    navigate("/Chat");
  }

  return (
    <>
      <nav class="bg-gray-800">
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div class="relative flex h-16 items-center justify-between">
            <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span class="absolute -inset-0.5"></span>
                <span class="sr-only">Open main menu</span>

                <svg
                  class="block size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>

                <svg
                  class="hidden size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div class="flex shrink-0 items-center">
                <img
                  class="h-8 w-auto cursor-pointer"
                  onclick={goToHome}
                  src={trelloLogo}
                  alt="Your Company"
                />
              </div>
              <div class="hidden sm:ml-6 sm:block">
                <div class="flex space-x-4">
                  <a
                    href="#"
                    class="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                    aria-current="page"
                  >
                    Dashboard
                  </a>
                  <a
                    href="#"
                    class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    onclick={goToChat}
                  >
                    Chat
                  </a>
                  <a
                    href="#"
                    class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    onclick={goToContactRequestList}
                  >
                    Contact Request List
                  </a>
                  <a
                    href="#"
                    class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    onclick={goToSearchUser}
                  >
                    Search User
                  </a>
                </div>
              </div>
            </div>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span class="absolute -inset-1.5"></span>
                <span class="sr-only">View notifications</span>
                <svg
                  class="size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
              </button>

              <div class="relative ml-3">
                <div>
                  <button
                    type="button"
                    class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onclick={goToProfile}
                  >
                    <span class="absolute -inset-1.5"></span>
                    <span class="sr-only">Open user menu</span>
                    <img
                      class="size-8 rounded-full"
                      src={porfileImg()}
                      alt=""
                    />
                  </button>
                </div>
              </div>
              <div class="relative ml-3">
                <div>
                  <button
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onclick={logout}
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="sm:hidden" id="mobile-menu">
          <div class="space-y-1 px-2 pb-3 pt-2">
            <a
              href="#"
              class="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
              aria-current="page"
            >
              Dashboard
            </a>
            <a
              href="#"
              class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onclick={goToChat}
            >
              Chat
            </a>
            <a
              href="#"
              class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onclick={goToContactRequestList}
            >
              Contact Request List
            </a>
            <a
              href="#"
              class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onclick={goToSearchUser}
            >
              Search User
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
