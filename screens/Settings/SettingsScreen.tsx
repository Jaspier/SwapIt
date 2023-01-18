import { View, Text, TouchableOpacity, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeArea } from "../../components/utilities";
import Header from "../../components/Header/Header";
import {
  DefaultProfilePic,
  ProfilePicContainer,
  ProfilePicture,
  SettingsContainer,
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
import { updateProfile } from "firebase/auth";
import { useRoute } from "@react-navigation/core";
import { v4 as uuidv4 } from "uuid";
import { Storage } from "aws-amplify";
import { CLOUD_FRONT_API_ENDPOINT } from "@env";

const SettingsScreen = ({ navigation }: any) => {
  const [photo, setPhoto] = useState("");
  const [photoTaken, setPhotoTaken] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [initialDisplayName, setInitialDisplayName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [incompleteForm, setIncompleteForm] = useState(true);
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { user, logout }: AuthContextInterface = authContext;

  const { params } = useRoute();
  useEffect(() => {
    if (user && user.displayName) {
      setDisplayName(user.displayName);
      setInitialDisplayName(user.displayName);
    }
    if (user && user.photoURL) {
      setPhoto(user.photoURL);
    }
    if (params) {
      // @ts-ignore
      const { photo } = params;
      setPhoto(photo.uri);
      setPhotoTaken(true);
      setIncompleteForm(false);
    }
  }, [user, params]);

  useEffect(() => {
    if (displayName !== initialDisplayName && displayName !== "") {
      setIncompleteForm(false);
    } else {
      setIncompleteForm(true);
    }
  }, [displayName, initialDisplayName, user]);

  const updateUserInfo = async () => {
    setProcessing(true);
    let key;
    if (photoTaken) {
      const imageUrl = photo;
      const response = await fetch(photo);
      const blob = await response.blob();
      const urlParts = imageUrl.split(".");
      const extension = urlParts[urlParts.length - 1];
      key = `${uuidv4()}.${extension}`;
      if (user && user.photoURL) {
        await Storage.remove(`profiles/${user.photoURL}`);
      }
      await Storage.put(`profiles/${key}`, blob);
    }
    // @ts-ignore
    updateProfile(user, {
      displayName: displayName,
      photoURL: photoTaken ? key : user?.photoURL,
    })
      .then(() => {
        setProcessing(false);
        setIncompleteForm(true);
      })
      .catch((error) => {
        alert(error.message);
      });
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
      <Header title="Settings" />
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
      <ButtonContainer>
        <UpdateProfileButton
          onPress={() => updateUserInfo()}
          disabled={incompleteForm || processing}
        >
          <ButtonText>Update</ButtonText>
        </UpdateProfileButton>
      </ButtonContainer>
      <Button title="Logout" onPress={() => logout()} />
    </SafeArea>
  );
};

export default SettingsScreen;
