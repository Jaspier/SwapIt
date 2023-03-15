import { Coords, Profile } from "./types";
import axios from "axios";

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
    console.error(e.message);
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
