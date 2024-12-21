import {
  createContext,
  useContext,
  createSignal,
  onMount,
  createEffect,
  onCleanup,
} from "solid-js";
import SD from "../SD";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { showErrorToast } from "~/util/showToast";
import axios from "axios";
import { useAuth } from "./authContext";
import useWebSocket from "~/hook/useWebSocket";

type AppContextType = {
  fristName: Function;
  lastName: Function;
  email: Function;
  profileImgUrl: Function;
  userid: Function;
};

interface CustomJwtPayload extends JwtPayload {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
}

const AppContext = createContext<AppContextType>();

export const AppProvider = (props: any) => {
  const [fristName, setFristName] = createSignal("");
  const [lastName, setlastName] = createSignal("");
  const [email, setemail] = createSignal("");
  const [userid, setuserid] = createSignal("");
  const [profileImgUrl, setprofileImgUrl] = createSignal("");
  const authContext = useAuth();

  onMount(() => {
    setCredentials();
  });

  createEffect(() => {
    document.addEventListener("itemInserted", () => {
      setCredentials();
    });
  });

  // private helper funciton
  async function setCredentials() {
    try {
      const jwt: string | null = window.localStorage.getItem(
        SD.localStorageKeys.jwt
      );
      console.log(jwt);

      if (jwt == null) {
        return;
      }
      var decoded: CustomJwtPayload;

      if (jwt != null) {
        try {
          decoded = jwtDecode(jwt);

          setFristName(decoded.firstName);
          setlastName(decoded.lastName);
          setemail(decoded.email);
          setuserid(decoded.id);
        } catch (err) {
          console.log(err);
          showErrorToast(err);
        }
      }

      const { data } = await axios.get(
        `/api/Image/profileimage?profileid=${userid()}`
      );
      const profileUrl: string = data.data;
      setprofileImgUrl(profileUrl);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AppContext.Provider
      value={{ fristName, lastName, email, profileImgUrl, userid }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
