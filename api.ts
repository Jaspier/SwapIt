import { Coords, Profile } from "./types";
import axios from "axios";
import { NavigationProp } from "@react-navigation/core";

export const checkUserExists = async (accessToken: string) => {
  try {
    const response = await axios.get("/checkUserExists", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.status === 200;
  } catch (e: any) {
    console.log("New User");
  }
};

export const updateLocation = async (
  accessToken: string,
  city: string,
  coords: Coords
) => {
  axios
    .post(
      "/updateLocation",
      {
        location: city,
        coords: coords,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .catch((e) => {
      console.error(e.response.data.detail);
    });
};

export const getSearchPreferences = async (accessToken: string) => {
  try {
    const res = await axios.get("/getSearchPreferences", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return {
      userCoords: res.data.coords,
      radius: res.data.radius,
      passes: res.data.passes,
      swipes: res.data.swipes,
    };
  } catch (e: any) {
    console.error(e.response.data.detail);
  }
};

export const pass = async (accessToken: string, userSwiped: Profile) => {
  axios
    .post("/swipeLeft", userSwiped, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .catch((e) => {
      console.error(e.response.data.detail);
    });
};

export const like = async (accessToken: string, userSwiped: Profile) => {
  try {
    const response = await axios.post("/swipeRight", userSwiped, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (e: any) {
    console.error(e.response.data.detail);
  }
};

export const sendPushNotification = async (
  accessToken: string,
  type: string,
  matchDetails: any,
  message: string
) => {
  axios
    .post(
      "/sendPushNotification",
      {
        type,
        matchDetails,
        message,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .catch((e) => {
      console.error(e.response.data.detail);
    });
};

export const myProfile = async (accessToken: string) => {
  try {
    const res = await axios.get("/myprofile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (e: any) {
    console.error(e.response.data.detail);
  }
};

export const createProfile = async (
  user: any,
  imagesSelected: boolean,
  imageAllUrls: { uri: string }[],
  initialPhotoUrls: string,
  itemName: string,
  location: string | null,
  coords: Coords,
  isNewUser: boolean | null | undefined,
  navigation: NavigationProp<any>,
  setProcessing: any
) => {
  try {
    const response = await axios.post(
      "/createProfile",
      {
        id: user.uid,
        displayName: user.displayName ? user.displayName : user.email,
        photoUrls: imagesSelected
          ? JSON.stringify(imageAllUrls)
          : JSON.stringify(initialPhotoUrls),
        itemName: itemName,
        location: location,
        coords: coords,
        active: true,
        radius: 50,
        isNewUser: isNewUser,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.stsTokenManager.accessToken}`,
        },
      }
    );
    setProcessing(false);
    if (response.status === 204 && response.data.isNewUser) {
      navigation.navigate("Settings", { newUser: true });
    } else {
      navigation.navigate("Home", { refresh: true });
    }
  } catch (e: any) {
    console.error(e.response.data.detail);
  }
};

export const getInitialDistance = async (accessToken: string) => {
  try {
    const res = await axios.get("/getSearchRadius", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (e: any) {
    console.error(e.response.data.detail);
  }
};

export const updateUserPreferences = async (
  accessToken: string,
  displayName: string,
  distance: number
) => {
  try {
    const response = await axios.post(
      "/updateUserPreferences",
      {
        displayName: displayName,
        radius: distance,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.status === 204;
  } catch (e: any) {
    console.error(e.response.data.detail);
  }
};
