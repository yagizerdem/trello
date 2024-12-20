import { useSearchParams } from "@solidjs/router";
import axios from "axios";
import { createEffect, createSignal } from "solid-js";
import AppNavBar from "~/components/AppNavBar";
import RouteGuard from "~/components/RouteGuard";
import { useApp } from "~/context/appContext";
import { useAuth } from "~/context/authContext";
import { User } from "~/entity/user";
import ApiResponse from "~/util/apiResponse";
import { showErrorToast, showSuccessToast } from "~/util/showToast";

export default function Profile() {
  const appContext = useApp();
  const [isOwnProfile, setIsOwnProfile] = createSignal(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = () => Number(searchParams.userId); // Create a reactive function for userId
  const [currentUser, setCurrentUser] = createSignal<User | null>(null);
  const [profileImg, setprofileImg] = createSignal<string>("");

  // check current user
  createEffect(() => {
    if (userId() == appContext?.userid()) {
      setIsOwnProfile(true);
      const userDto = new User();
      userDto.email = appContext.email();
      userDto.firstName = appContext.fristName();
      userDto.lastName = appContext.lastName();
      userDto.id = appContext.userid();
      userDto.profileImageUrl = appContext.profileImgUrl();
      setCurrentUser(userDto);
      setprofileImg(appContext.profileImgUrl());
    }
  });
  // fetch contact
  createEffect(async () => {
    if (userId() && !isOwnProfile()) {
      const userfromdb: User = await fetchUser(userId());
      setCurrentUser(userfromdb);
      // fetch profl id
      const profileUrlFromDb = await fetchProfilePhoto(userfromdb.id);
      if (profileUrlFromDb) {
        setprofileImg(profileUrlFromDb);
      }
    }
  });

  async function sendContactRequest() {
    const destUserId = currentUser()?.id;
    try {
      const jwt = window.localStorage.getItem("jwt");
      const response = await axios.post(
        "/api/Users/contactRequest",
        {
          destUserId: destUserId,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      const apiResponse: ApiResponse = response.data;

      if (!apiResponse.success) {
        showErrorToast(apiResponse.errors.join("\n"));
        return;
      } else {
        showSuccessToast(
          apiResponse.message ?? "user contact request send successfully"
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <RouteGuard>
      <AppNavBar />
      <img
        src={profileImg()}
        class=" rounded-lg my-10 block mx-auto"
        style="width:400px box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;"
      />
      {!isOwnProfile() && (
        <div class="flex items-center">
          <button
            type="button"
            class="btn btn-primary block mx-auto"
            onclick={sendContactRequest}
          >
            Send Contact Request
          </button>
        </div>
      )}
      profile page
    </RouteGuard>
  );
}

async function fetchUser(userId: number) {
  try {
    const { data } = await axios.get("/api/Users/fetchUsers", {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        userId: userId,
      },
    });
    return data.data[0];
  } catch (err) {
    console.log(err);
    showErrorToast("error occured while fetching user profile ... ");
  }
}

async function fetchProfilePhoto(userid: number) {
  try {
    const { data } = await axios.get(
      `/api/Image/profileimage?profileid=${userid}`
    );
    const profileUrl: string = data.data;
    return profileUrl;
  } catch (err) {
    console.log(err);
    return null;
  }
}
