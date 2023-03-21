import {
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
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
  DetailsContainer,
} from "./profileStyles";
import {
  Label,
  Input,
  ButtonContainer,
  ButtonText,
  UpdateProfileButton,
} from "../../components/form";
import "react-native-get-random-values";
import { CLOUD_FRONT_API_ENDPOINT } from "@env";
import { useRoute } from "@react-navigation/core";
import { colors } from "../../theme/colors";
import Toast from "react-native-toast-message";
import { useGetUserLocation, useNotificationHandler } from "../../helpers";
import {
  useCheckIncompleteForm,
  useFetchUserProfile,
  pickImages,
  storeToDB,
} from "./profileHelpers";
import { NotificationContext } from "../../hooks/notifications/notificationContext";

const ProfileScreen = ({ navigation }: any) => {
  const { params } = useRoute();
  let isNewUser: boolean | null | undefined;
  if (params) {
    // @ts-ignore
    const { newUser } = params;
    isNewUser = newUser;
  }
  const [images, setImages] = useState<ImagePicker.ImageInfo[] | null>(null);
  const [imagesSelected, setImagesSelected] = useState(false);
  const { notifications, removeNotification } = useContext(NotificationContext);
  const [incompleteForm, setIncompleteForm] = useState(true);
  const [initialPhotoUrls, setInitialPhotoUrls] = useState("");
  const [itemName, setItemName] = useState("");
  const [initialItemName, setInitialItemName] = useState("");
  const [location, setLocation] = useState<null | string>("");
  const [coords, setCoords] = useState({ longitude: 0, latitude: 0 });
  const [processing, setProcessing] = useState(false);
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { user }: AuthContextInterface = authContext;

  useNotificationHandler(notifications, navigation, removeNotification, Toast);

  useGetUserLocation(user, isNewUser, true, setLocation, setCoords);

  useFetchUserProfile(
    user,
    isNewUser,
    setLocation,
    setImages,
    setInitialPhotoUrls,
    setItemName,
    setInitialItemName
  );

  useCheckIncompleteForm(
    isNewUser,
    itemName,
    initialItemName,
    imagesSelected,
    setIncompleteForm
  );

  return (
    <SafeArea>
      <Header
        title={isNewUser ? "Create Profile" : "Profile"}
        isNewUser={isNewUser}
        settings
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <DisplayName>
            Hello,{" "}
            {user && !user.displayName ? user.email : user && user.displayName}
          </DisplayName>
          <DetailsContainer>
            <Label>Your item for swap</Label>
            <Input
              value={itemName ? itemName : ""}
              onChangeText={setItemName}
              maxLength={19}
              placeholder="Enter the name of your item"
            />
            <Label>Current location</Label>
            <Input
              style={{ color: colors.text.disabled }}
              value={location ? location : ""}
              editable={false}
              placeholder="Enter your location"
            />
          </DetailsContainer>
          <ImagePickerPressable
            onPress={() => pickImages(setImagesSelected, setImages)}
          >
            <AntDesign name="pluscircle" size={24} color="grey" />
          </ImagePickerPressable>
        </View>
      </TouchableWithoutFeedback>
      <MaxImagesText>Upload images [Max 3 photos]</MaxImagesText>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={images}
        renderItem={({ item }) => (
          <SelectedImages
            source={{
              uri: imagesSelected
                ? item.uri
                : `${CLOUD_FRONT_API_ENDPOINT}/fit-in/400x400/public/profiles/${user?.uid}/items/${item.uri}`,
            }}
          />
        )}
      />
      <ButtonContainer>
        <UpdateProfileButton
          disabled={incompleteForm || processing}
          onPress={() =>
            storeToDB(
              user,
              images,
              imagesSelected,
              initialPhotoUrls,
              itemName,
              location,
              coords,
              isNewUser,
              navigation,
              setProcessing
            )
          }
        >
          <ButtonText>Update Profile</ButtonText>
        </UpdateProfileButton>
      </ButtonContainer>
      <Toast />
    </SafeArea>
  );
};

export default ProfileScreen;
