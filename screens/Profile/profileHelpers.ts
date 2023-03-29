import { Coords } from "./../../types";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { NavigationProp } from "@react-navigation/core";
import { Storage } from "aws-amplify";
import { createProfile, myProfile } from "../../api";
import { useEffect } from "react";
import deleteS3Folder from "../../lib/deleteS3Folder";
import extractPhoto from "../../lib/extractPhoto";

export const useFetchUserProfile = (
  user: any,
  isNewUser: boolean | null | undefined,
  setLocation: React.Dispatch<React.SetStateAction<string | null>>,
  setImages: React.Dispatch<
    React.SetStateAction<ImagePicker.ImageInfo[] | null>
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
        const itemName = documentSnapshot.itemName;
        const location = documentSnapshot.location;
        setImages(images);
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
        const { key, blob } = await extractPhoto(component.uri);
        imageAllUrls.push({ uri: key });

        const folderPath = `profiles/${user.uid}/items/`;
        await deleteS3Folder(folderPath);
        const objectKey = `${folderPath}${key}`;
        await Storage.put(objectKey, blob);
      }
      if (index + 1 === images.length && user) {
        const response = await createProfile(
          user,
          imagesSelected,
          imageAllUrls,
          initialPhotoUrls,
          itemName,
          location,
          coords,
          isNewUser
        );
        setProcessing(false);
        if (response && response.status === 200 && response.data.isNewUser) {
          navigation.navigate("Settings", { newUser: true });
        } else {
          navigation.navigate("Home", { refresh: true });
        }
      }
    });
};
