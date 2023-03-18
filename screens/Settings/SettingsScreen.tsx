import {
  View,
  TouchableOpacity,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeArea } from "../../components/utilities";
import Header from "../../components/Header/Header";
import {
  DefaultProfilePic,
  DistanceSlider,
  ProfilePicContainer,
  ProfilePicture,
  SettingsContainer,
  SliderContainer,
  UserEmail,
} from "./SettingsStyles";
import {
  Label,
  Input,
  ButtonContainer,
  ButtonText,
  UpdateProfileButton,
} from "../../components/form";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import { useRoute } from "@react-navigation/core";
import { colors } from "../../theme/colors";
import { CLOUD_FRONT_API_ENDPOINT } from "@env";
import Toast from "react-native-toast-message";
import {
  getUserSettings,
  fetchInitialDistance,
  checkIncompleteForm,
  updateUserInfo,
  removeProfilePicture,
} from "./settingsHelper";
import { NotificationContext } from "../../hooks/notifications/notificationContext";
import { notificationHandler } from "../Home/homeHelpers";

const SettingsScreen = ({ navigation }: any) => {
  const [photo, setPhoto] = useState("");
  const [photoTaken, setPhotoTaken] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [initialDisplayName, setInitialDisplayName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [incompleteForm, setIncompleteForm] = useState(true);
  const [distance, setDistance] = useState(0);
  const [initialDistance, setInitialDistance] = useState(0);
  const { notifications, removeNotification } = useContext(NotificationContext);
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { user, logout }: AuthContextInterface = authContext;

  const { params } = useRoute();

  let isNewUser: boolean | null | undefined;
  if (params) {
    // @ts-ignore
    const { newUser } = params;
    isNewUser = newUser;
  }

  notificationHandler(notifications, navigation, removeNotification, Toast);

  getUserSettings(
    user,
    params,
    setDisplayName,
    setInitialDisplayName,
    setPhoto,
    setPhotoTaken,
    setIncompleteForm
  );

  fetchInitialDistance(user, distance, setDistance, setInitialDistance);

  checkIncompleteForm(
    displayName,
    initialDisplayName,
    distance,
    initialDistance,
    setIncompleteForm
  );

  return (
    <SafeArea>
      <Header
        title={isNewUser ? "Set Preferences" : "Settings"}
        isNewUser={isNewUser}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <ProfilePicContainer>
            <TouchableOpacity onPress={() => navigation.navigate("Camera")}>
              {!photo && (
                <DefaultProfilePic
                  label={user ? user.email.charAt(0).toUpperCase() : "NULL"}
                />
              )}
              {photo && (
                <ProfilePicture
                  source={{
                    uri: photoTaken
                      ? photo
                      : `${CLOUD_FRONT_API_ENDPOINT}/fit-in/400x400/public/profiles/${photo}`,
                  }}
                />
              )}
            </TouchableOpacity>
          </ProfilePicContainer>
          {user && user.photoURL && (
            <Button
              title="Remove Profile Picture"
              onPress={() => removeProfilePicture(user, navigation)}
            />
          )}
          <UserEmail>{user ? user.email : "NULL"}</UserEmail>
          <SettingsContainer>
            <Label>Username</Label>
            <Input
              value={displayName ? displayName : ""}
              onChangeText={setDisplayName}
              placeholder="Enter your username"
            />
          </SettingsContainer>
        </View>
      </TouchableWithoutFeedback>
      <SliderContainer>
        <Label>Search Distance ({distance}mi)</Label>
        <DistanceSlider
          minimumValue={1}
          maximumValue={100}
          step={1}
          onValueChange={(value) => setDistance(value)}
          value={distance}
          minimumTrackTintColor={colors.brand.primary}
          thumbTintColor={colors.brand.primary}
          maximumTrackTintColor={colors.ui.disabled}
        />
      </SliderContainer>
      <ButtonContainer>
        <UpdateProfileButton
          onPress={() =>
            updateUserInfo(
              user,
              photoTaken,
              photo,
              displayName,
              distance,
              setIncompleteForm,
              setProcessing,
              navigation
            )
          }
          disabled={incompleteForm || processing}
        >
          <ButtonText>Update</ButtonText>
        </UpdateProfileButton>
      </ButtonContainer>
      <Button title="Logout" onPress={() => logout()} />
      <Toast />
    </SafeArea>
  );
};

export default SettingsScreen;
