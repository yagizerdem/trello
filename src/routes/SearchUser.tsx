import axios from "axios";
import { createSignal } from "solid-js";
import AppNavBar from "~/components/AppNavBar";
import Loader from "~/components/loader";
import RouteGuard from "~/components/RouteGuard";
import UserCard from "~/components/UserCard";
import { User } from "~/entity/user";
import { showInfoToast } from "~/util/showToast";

const limit = 2;

export default function SearchUser() {
  const [searchedUsers, setSearchedUsers] = createSignal<Array<User>>([]);
  const [page, setPage] = createSignal(0);
  const [hasMore, setHasMore] = createSignal(true);
  const [isLoading, setIsLoading] = createSignal(false);

  let userNameInput; // ref

  async function search(refresh: boolean = false) {
    if (refresh) {
      setSearchedUsers([]);
      setPage(0);
      setHasMore(true);
    }
    setIsLoading(true);
    if (userNameInput) {
      var input: HTMLInputElement = userNameInput as HTMLInputElement;
      const query = input.value;
      try {
        const { data } = await axios.get("/api/Users/fetchUsers", {
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            userName: query,
            limit: limit,
            skip: page() * limit,
          },
        });
        const filteredUsers: Array<User> = data.data;

        if (filteredUsers.length > 0) {
          setSearchedUsers((prev) => [...prev, ...filteredUsers]);
        } else {
          showInfoToast("all users fetched");
          setHasMore(false);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function loadMore() {
    setPage((prev) => prev + 1);
    search(false);
  }

  return (
    <RouteGuard>
      <AppNavBar />
      <div class="">
        <div class="flex justify-center items-center w-full  sm:flex-row flex-col">
          <input
            class="w-1/2 sm:1/4 lg:max-w-[500px] border bg-gray-50  border-gray-300 text-gray-900 bold rounded-md  block sm:my-11 my-2 py-3 px-2 text-lg "
            style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;"
            placeholder="enter user name"
            ref={userNameInput}
          ></input>
          <button
            type="button"
            class="btn btn-primary mx-10 my-2 sm:my-0"
            style="box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;"
            onclick={() => search(true)}
          >
            Search
          </button>
        </div>
      </div>
      <div class="lg:w-8/12 w-11/12 mx-auto flex flex-wrap items-center justify-center">
        {searchedUsers().map((user: User) => {
          return (
            <div class="mx-10 my-10">
              <UserCard
                firstName={user.firstName}
                lastName={user.lastName}
                email={user.email}
                profileImgUrl={user.profileImageUrl}
                userId={Number(user.id)}
              />
            </div>
          );
        })}
      </div>
      {isLoading() && (
        <div class="flex items-center justify-center mx-auto w-full my-10 ">
          <Loader color="red" />
        </div>
      )}
      {hasMore() && searchedUsers().length > 0 && (
        <div class="flex items-center my-3">
          <button
            type="button"
            class="btn btn-primary block mx-auto"
            onclick={loadMore}
          >
            LoadMore
          </button>
        </div>
      )}
    </RouteGuard>
  );
}
