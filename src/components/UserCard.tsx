import { useNavigate } from "@solidjs/router";
import { createMemo } from "solid-js";

interface UserCardProps {
  firstName: string;
  lastName: string;
  email: string;
  userId: number;
  profileImgUrl: string;
  onClick?: Function;
}
export default function UserCard({
  firstName,
  lastName,
  email,
  profileImgUrl,
  userId,
  onClick,
}: UserCardProps) {
  const navigate = useNavigate();
  const fullName = createMemo<string>(() => `${firstName} ${lastName}`);
  const imgURI = createMemo<string>(() => {
    if (!profileImgUrl) {
      return "  ./assets/blank-profile-picture-973460_1280.webp";
    }
    return `http://localhost:3000/src/uploads/profileImages/${profileImgUrl}`;
  });

  function goToProfile() {
    navigate(`/Profile?userId=${userId}`);
  }

  return (
    <>
      <a class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <img
          src={imgURI()}
          class="mx-auto my-2 rounded-md"
          style="width:100px; height:100px; box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;"
        ></img>
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
          {fullName()}
        </h5>
        <h6 class="mb-2 text-2xl  tracking-tight text-gray-900 dark:text-white text-center">
          {email}
        </h6>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mx-auto block  cursor-pointer"
          onclick={goToProfile}
        >
          go to profile
        </button>
      </a>
    </>
  );
}
