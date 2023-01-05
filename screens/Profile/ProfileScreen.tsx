import { Button, FlatList, Platform } from "react-native";
import React, { useState } from "react";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import { SafeArea } from "../../components/utilities";
import * as ImagePicker from "expo-image-picker";
import Header from "../../components/Header/Header";
import { AntDesign } from "@expo/vector-icons";
import {
  DisplayName,
  ImagePickerPressable,
  MaxImagesText,
  SelectedImages,
  ButtonContainer,
  UpdateProfileButton,
  ButtonText,
} from "./profileStyles";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Storage } from "aws-amplify";

const ProfileScreen = () => {
  const [images, setImages] = useState<ImagePicker.ImageInfo[] | null>(null);
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { user, logout }: AuthContextInterface = authContext;

  const pickImages = async () => {
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
          }
        }
      }
    })();
  };

  const imageAllUrls: { imageUri: string }[] = [];
  const storeToDB = async () => {
    images &&
      images.map(async (component, _) => {
        const imageUrl = component.uri;
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const urlParts = imageUrl.split(".");
        const extension = urlParts[urlParts.length - 1];
        const key = `${uuidv4()}.${extension}`;
        imageAllUrls.push({ imageUri: key });
        await Storage.put(key, blob);
      });
  };

  return (
    <SafeArea>
      <Header title="Profile" />
      <DisplayName>{user ? user.email : "NULL"}</DisplayName>
      <ImagePickerPressable onPress={pickImages}>
        <AntDesign name="pluscircle" size={24} color="grey" />
      </ImagePickerPressable>
      <MaxImagesText>Upload images [Max 3 photos]</MaxImagesText>
      <FlatList
        horizontal={true}
        data={images}
        renderItem={({ item }) => <SelectedImages source={{ uri: item.uri }} />}
      />
      <ButtonContainer>
        <UpdateProfileButton onPress={() => storeToDB()}>
          <ButtonText>Update Profile</ButtonText>
        </UpdateProfileButton>
      </ButtonContainer>
      <Button title="Logout" onPress={() => logout()} />
    </SafeArea>
  );
};

export default ProfileScreen;
