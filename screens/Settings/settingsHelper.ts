import { useEffect } from "react";
import { getInitialDistance, updateUserPreferences } from "../../api";
import { NavigationProp } from "@react-navigation/core";
import { v4 as uuidv4 } from "uuid";
import { Storage } from "aws-amplify";
import { updateProfile } from "firebase/auth";
import displayError from "../../lib/displayError";
import extractPhoto from "../../lib/extractPhoto";

export const useGetUserSettings = (
  user: any,
  params: any,
  setDisplayName: React.Dispatch<React.SetStateAction<string>>,
  setInitialDisplayName: React.Dispatch<React.SetStateAction<string>>,
  setPhoto: React.Dispatch<React.SetStateAction<string>>,
  setPhotoTaken: React.Dispatch<React.SetStateAction<boolean>>,
  setIncompleteForm: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  useEffect(() => {
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
  }, [
    user,
    params,
    setDisplayName,
    setInitialDisplayName,
    setPhoto,
    setPhotoTaken,
    setIncompleteForm,
  ]);
};

export const useFetchInitialDistance = (
  user: any,
  distance: number,
  setDistance: React.Dispatch<React.SetStateAction<number>>,
  setInitialDistance: React.Dispatch<React.SetStateAction<number>>
) => {
  useEffect(() => {
    const fetchInitialDistance = async () => {
      const fetchedInitialDistance = await getInitialDistance(
        user.stsTokenManager.accessToken
      );
      if (fetchInitialDistance != undefined) {
        if (distance === 0) {
          setDistance(fetchedInitialDistance);
        }
        setInitialDistance(fetchedInitialDistance);
      }
    };

    if (user) {
      fetchInitialDistance();
    }
  }, [user, distance, setDistance, setInitialDistance]);
};

export const useCheckIncompleteForm = (
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
    setProcessing(true);
    if (photoTaken) {
      const { key, blob } = await extractPhoto(photo);
      if (user.photoURL) {
        await Storage.remove(`profiles/${user.uid}/${user.photoURL}`);
      }
      await Storage.put(`profiles/${user.uid}/${key}`, blob);
    }
    // @ts-ignore
    updateProfile(user, {
      displayName: displayName,
      photoURL: photoTaken ? key : user.photoURL,
    }).catch((e: any) => {
      displayError(e.message);
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
    await Storage.remove(`profiles/${user.uid}/${user.photoURL}`);
  }
};
