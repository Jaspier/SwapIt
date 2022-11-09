import { Button, Image, FlatList, Platform } from "react-native";
import React, { useState } from "react";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import { SafeArea } from "../../components/utilities";
import * as ImagePicker from "expo-image-picker";
import Header from "../../components/Header/Header";

const ProfileScreen = () => {
  const [images, setImages] = useState<ImagePicker.ImageInfo[] | null>(null);
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { logout }: AuthContextInterface = authContext;

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

  return (
    <SafeArea>
      <Header title="Profile" />
      <Button title="Pick an image from camera roll" onPress={pickImages} />
      <FlatList
        horizontal={true}
        data={images}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.uri }}
            style={{ width: 200, height: 200 }}
          />
        )}
      />
      <Button title="Logout" onPress={() => logout()} />
    </SafeArea>
  );
};

export default ProfileScreen;
