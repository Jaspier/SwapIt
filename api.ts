import { Coords, Match, Profile } from "./types";
import axios from "axios";
import displayError from "./lib/displayError";

const version = "v1";

export const storeDeviceToken = async (
  accessToken: string,
  deviceToken: string
) => {
  axios
    .post(`/${version}/store_device_token`, deviceToken, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .catch((e) => {
      displayError(e.response.data.detail);
    });
};

export const checkUserExists = async (accessToken: string) => {
  try {
    const response = await axios.get(`/${version}/check_user_exists`, {
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
      `/${version}/update_location`,
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
      displayError(e.response.data.detail);
    });
};

export const getSearchPreferences = async (accessToken: string) => {
  try {
    const res = await axios.get(`/${version}/get_search_preferences`, {
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
    displayError(e.response.data.detail);
  }
};

export const pass = async (accessToken: string, userSwiped: Profile) => {
  axios
    .post(`/${version}/swipe_left`, userSwiped, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .catch((e) => {
      displayError(e.response.data.detail);
    });
};

export const like = async (accessToken: string, userSwiped: Profile) => {
  try {
    const response = await axios.post(`/${version}/swipe_right`, userSwiped, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (e: any) {
    displayError(e.response.data.detail);
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
      `/${version}/send_push_notification`,
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
      console.log(e.response.data);
    });
};

export const myProfile = async (accessToken: string) => {
  try {
    const res = await axios.get(`/${version}/my_profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (e: any) {
    displayError(e.response.data.detail);
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
  isNewUser: boolean | null | undefined
) => {
  try {
    const response = await axios.post(
      `/${version}/create_profile`,
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
    return response;
  } catch (e: any) {
    displayError(e.response.data.detail);
  }
};

export const getInitialDistance = async (accessToken: string) => {
  try {
    const res = await axios.get(`/${version}/get_search_radius`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (e: any) {
    displayError(e.response.data.detail);
  }
};

export const updateUserPreferences = async (
  accessToken: string,
  displayName: string,
  distance: number,
  photoKey: string
) => {
  try {
    const response = await axios.post(
      `/${version}/update_user_preferences`,
      {
        displayName: displayName,
        radius: distance,
        photoKey: photoKey,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.status === 200;
  } catch (e: any) {
    displayError(e.response.data.detail);
  }
};

export const deleteMatch = async (user: any, usersMatched: string[]) => {
  axios
    .post(`/${version}/delete_match`, usersMatched, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.stsTokenManager.accessToken}`,
      },
    })
    .catch((e) => {
      displayError(e.response.data.detail);
    });
};

export const sendMessage = async (
  accessToken: string,
  matchId: string,
  input: string,
  type: string
) => {
  try {
    const response = await axios.post(
      `/${version}/send_message`,
      {
        matchId,
        message: input,
        type,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.status === 200;
  } catch (e: any) {
    displayError(e.response.data.detail);
  }
};

export const deleteMatches = async (
  accessToken: string,
  itemName: string,
  matchedUserId: string
) => {
  try {
    const response = await axios.post(
      `/${version}/delete_matches`,
      {
        itemName,
        matchedUserId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (e: any) {
    displayError(e.response.data.detail);
  }
};

export const sendManyPushNotifications = async (
  accessToken: string,
  notificationsObject: any
) => {
  try {
    axios.post(
      `/${version}/send_many_push_notifications`,
      notificationsObject,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (e: any) {
    displayError(e.response.data.detail);
  }
};

export const cancelSwap = async (accessToken: string, matchDetails: Match) => {
  try {
    const response = await axios.post(
      `/${version}/cancel_swap`,
      matchDetails.usersMatched,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.status === 200;
  } catch (e: any) {
    displayError(e.response.data.detail);
  }
};

export const confirmSwap = async (accessToken: string, matchDetails: Match) => {
  try {
    axios.post(`/${version}/confirm_swap`, matchDetails.usersMatched, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (e: any) {
    displayError(e.response.data.detail);
  }
};

export const resetProfile = async (user: any) => {
  axios
    .get(`/${version}/reset_profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.stsTokenManager.accessToken}`,
      },
    })
    .catch((e: any) => {
      displayError(e.response.data.detail);
    });
};

export const updateUserStatus = async (accessToken: string, status: string) => {
  axios
    .post(`/${version}/update_user_status`, status, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .catch((e) => {
      displayError(e.response.data.detail);
    });
};
