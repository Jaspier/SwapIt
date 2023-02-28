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
import { v4 as uuidv4 } from "uuid";
import { Storage } from "aws-amplify";
import { colors } from "../../theme/colors";
import axios from "axios";
import { updateProfile } from "firebase/auth";
import { CLOUD_FRONT_API_ENDPOINT } from "@env";
import Toast from "react-native-toast-message";
import { NotificationContext } from "../../hooks/notifications/notificationContext";

const SettingsScreen = ({ navigation }: any) => {
  const { notification, setNotification } = useContext(NotificationContext);
  const [photo, setPhoto] = useState("");
  const [photoTaken, setPhotoTaken] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [initialDisplayName, setInitialDisplayName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [incompleteForm, setIncompleteForm] = useState(true);
  const [distance, setDistance] = useState(0);
  const [initialDistance, setInitialDistance] = useState(0);
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

  useEffect(() => {
    if (notification && notification.type === "message") {
      Toast.show({
        type: "success",
        text1: `${notification.data.message.sender.displayName} (${notification.data.message.sender.itemName})`,
        text2: notification.data.message.message,
        onHide: () => setNotification(null),
      });
    }

    return () => {
      setNotification(null);
    };
  }, [notification, setNotification]);

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
      // @ts-ignore
      const { photo } = params;
      if (photo) {
        setPhoto(photo.uri);
        setPhotoTaken(true);
        setIncompleteForm(false);
      }
    }
  }, [user, params]);

  useEffect(() => {
    const getInitialDistance = async () => {
      if (user) {
        try {
          const res = await axios.get("/getSearchRadius", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.stsTokenManager.accessToken}`,
            },
          });
          const getInitialDistance = res.data;
          if (distance === 0) {
            setDistance(getInitialDistance);
          }
          setInitialDistance(getInitialDistance);
        } catch (e: any) {
          console.error(e.response.data.detail);
        }
      }
    };
    getInitialDistance();
  }, []);

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

  const updateUserInfo = async () => {
    setProcessing(true);
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
      }).catch((e) => {
        console.error(e.message);
      });
      axios
        .post(
          "/updateUserPreferences",
          {
            displayName: displayName,
            radius: distance,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.stsTokenManager.accessToken}`,
            },
          }
        )
        .then(() => {
          setProcessing(false);
          setIncompleteForm(true);
          navigation.navigate("Home", { distanceChanged: true });
        })
        .catch((e) => {
          console.error(e.response.data.detail);
        });
    }
  };

  const removeProfilePicture = async () => {
    if (user && user.photoURL) {
      // @ts-ignore
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
              onPress={() => removeProfilePicture()}
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
          onPress={() => updateUserInfo()}
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
