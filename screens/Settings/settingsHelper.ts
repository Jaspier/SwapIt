import { useEffect } from "react";
import { getInitialDistance, updateUserPreferences } from "../../api";
import { NavigationProp } from "@react-navigation/core";
import { v4 as uuidv4 } from "uuid";
import { Storage } from "aws-amplify";
import { updateProfile } from "firebase/auth";

export const getUserSettings = (
  user: any,
  params: any,
  setDisplayName: React.Dispatch<React.SetStateAction<string>>,
  setInitialDisplayName: React.Dispatch<React.SetStateAction<string>>,
  setPhoto: React.Dispatch<React.SetStateAction<string>>,
  setPhotoTaken: React.Dispatch<React.SetStateAction<boolean>>,
  setIncompleteForm: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  if (user) {
    if (user.displayName) {
      setDisplayName(user.displayName);
      setInitialDisplayName(user.displayName);
    }
    if (user.photoURL) {
      setPhoto(user.photoURL);
    }
  }
  if (params) {
    const { photo } = params;
    if (photo) {
      setPhoto(photo.uri);
      setPhotoTaken(true);
      setIncompleteForm(false);
    }
  }
};

export const fetchInitialDistance = async (
  accessToken: string,
  distance: number,
  setDistance: React.Dispatch<React.SetStateAction<number>>,
  setInitialDistance: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    const fetchedInitialDistance = await getInitialDistance(accessToken);
    if (distance === 0) {
      setDistance(fetchedInitialDistance);
    }
    setInitialDistance(fetchedInitialDistance);
  } catch (e: any) {
    console.error(e.response.data.detail);
  }
};

export const checkIncompleteForm = (
  displayName: string,
  initialDisplayName: string,
  distance: number,
  initialDistance: number,
  setIncompleteForm: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    if (
      (displayName !== initialDisplayName && displayName !== "") ||
      (distance !== initialDistance && distance !== 0)
    ) {
      setIncompleteForm(false);
    } else {
      setIncompleteForm(true);
    }
  }, [initialDistance, distance, displayName, initialDisplayName]);
};

export const updateUserInfo = async (
  user: any,
  photoTaken: boolean,
  photo: string,
  displayName: string,
  distance: number,
  setIncompleteForm: React.Dispatch<React.SetStateAction<boolean>>,
  setProcessing: React.Dispatch<React.SetStateAction<boolean>>,
  navigation: NavigationProp<any>
) => {
  let key;
  if (user) {
    if (photoTaken) {
      const imageUrl = photo;
      const response = await fetch(photo);
      const blob = await response.blob();
      const urlParts = imageUrl.split(".");
      const extension = urlParts[urlParts.length - 1];
      key = `${uuidv4()}.${extension}`;
      if (user.photoURL) {
        await Storage.remove(`profiles/${user.photoURL}`);
      }
      await Storage.put(`profiles/${key}`, blob);
    }
    // @ts-ignore
    updateProfile(user, {
      displayName: displayName,
      photoURL: photoTaken ? key : user.photoURL,
    }).catch((e: any) => {
      console.error(e.message);
    });
    const updated = await updateUserPreferences(
      user.stsTokenManager.accessToken,
      displayName,
      distance
    );
    if (updated) {
      setProcessing(false);
      setIncompleteForm(true);
      navigation.navigate("Home", { distanceChanged: true });
    }
  }
};

export const removeProfilePicture = async (
  user: any,
  navigation: NavigationProp<any>
) => {
  if (user && user.photoURL) {
    updateProfile(user, {
      photoURL: "",
    })
      .then(() => {
        navigation.goBack();
        navigation.navigate("Settings");
      })
      .catch((error) => {
        alert(error.message);
      });
    await Storage.remove(`profiles/${user.photoURL}`);
  }
};
