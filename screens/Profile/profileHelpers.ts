import { Coords } from "./../../types";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { NavigationProp } from "@react-navigation/core";
import { v4 as uuidv4 } from "uuid";
import { Storage } from "aws-amplify";
import { createProfile, myProfile } from "../../api";
import { useEffect } from "react";

export const useFetchUserProfile = (
  user: any,
  isNewUser: boolean | null | undefined,
  setLocation: React.Dispatch<React.SetStateAction<string | null>>,
  setImages: React.Dispatch<
    React.SetStateAction<ImagePicker.ImageInfo[] | null>
  >,
  setImagesToDelete: React.Dispatch<
    React.SetStateAction<ImagePicker.ImageInfo[]>
  >,
  setInitialPhotoUrls: React.Dispatch<React.SetStateAction<string>>,
  setItemName: React.Dispatch<React.SetStateAction<string>>,
  setInitialItemName: React.Dispatch<React.SetStateAction<string>>
): void => {
  useEffect(() => {
    const fetchUserProfileData = async () => {
      if (user && !isNewUser) {
        const documentSnapshot = await myProfile(
          user.stsTokenManager.accessToken
        );
        const images = JSON.parse(documentSnapshot.photoUrls);
        const imagesToDelete = JSON.parse(documentSnapshot.photoUrls);
        const itemName = documentSnapshot.itemName;
        const location = documentSnapshot.location;
        setImages(images);
        setImagesToDelete(imagesToDelete);
        setInitialPhotoUrls(images);
        setItemName(itemName);
        setInitialItemName(itemName);
        setLocation(location);
      }
    };
    fetchUserProfileData();
  }, [
    user,
    isNewUser,
    setImages,
    setImagesToDelete,
    setInitialPhotoUrls,
    setItemName,
    setInitialItemName,
    setLocation,
  ]);
};

export const useCheckIncompleteForm = (
  isNewUser: boolean | null | undefined,
  itemName: string,
  initialItemName: string,
  imagesSelected: boolean,
  setIncompleteForm: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    if (isNewUser && itemName !== "" && imagesSelected) {
      setIncompleteForm(false);
    } else if (
      (!isNewUser && itemName !== initialItemName) ||
      (itemName !== "" && imagesSelected)
    ) {
      setIncompleteForm(false);
    } else {
      setIncompleteForm(true);
    }
  }, [isNewUser, itemName, initialItemName, imagesSelected, setIncompleteForm]);
};

export const pickImages = async (setImagesSelected: any, setImages: any) => {
  (async () => {
    if (Platform.OS === "ios") {
      const { accessPrivileges } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (accessPrivileges === "none") {
        alert("No permission granted.");
      } else {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          selectionLimit: 3,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.cancelled) {
          setImages(result.selected);
          setImagesSelected(true);
        }
      }
    }
  })();
};

export const storeToDB = async (
  user: any,
  images: ImagePicker.ImageInfo[] | null,
  imagesSelected: boolean,
  imagesToDelete: ImagePicker.ImageInfo[],
  initialPhotoUrls: string,
  itemName: string,
  location: string | null,
  coords: Coords,
  isNewUser: boolean | null | undefined,
  navigation: NavigationProp<any>,
  setProcessing: any
) => {
  const imageAllUrls: { uri: string }[] = [];

  setProcessing(true);

  images &&
    images.map(async (component, index) => {
      if (imagesSelected) {
        const imageUrl = component.uri;
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const urlParts = imageUrl.split(".");
        const extension = urlParts[urlParts.length - 1];
        const key = `${uuidv4()}.${extension}`;
        imageAllUrls.push({ uri: key });
        for (let i in imagesToDelete) {
          await Storage.remove(imagesToDelete[i].uri);
        }
        await Storage.put(key, blob);
      }
      if (index + 1 === images.length && user) {
        createProfile(
          user,
          imagesSelected,
          imageAllUrls,
          initialPhotoUrls,
          itemName,
          location,
          coords,
          isNewUser,
          navigation,
          setProcessing
        );
      }
    });
};
