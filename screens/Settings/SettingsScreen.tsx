import { View, Text, TouchableOpacity, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeArea } from "../../components/utilities";
import Header from "../../components/Header/Header";
import {
  ButtonContainer,
  ButtonText,
  DefaultProfilePic,
  Input,
  Label,
  ProfilePicContainer,
  SettingsContainer,
  UpdateProfileButton,
  UserEmail,
} from "./SettingsStyles";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import { updateProfile } from "firebase/auth";

const SettingsScreen = () => {
  const [displayName, setDisplayName] = useState("");
  const [initialDisplayName, setInitialDisplayName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [incompleteForm, setIncompleteForm] = useState(true);
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { user, logout }: AuthContextInterface = authContext;

  useEffect(() => {
    if (user && user.displayName) {
      setDisplayName(user.displayName);
      setInitialDisplayName(user.displayName);
    }
  }, [user]);

  useEffect(() => {
    if (displayName !== initialDisplayName && displayName !== "") {
      setIncompleteForm(false);
    } else {
      setIncompleteForm(true);
    }
  }, [displayName, initialDisplayName, user]);

  const updateUserInfo = async () => {
    setProcessing(true);
    // @ts-ignore
    updateProfile(user, {
      displayName: displayName,
    })
      .then(() => {
        setProcessing(false);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <SafeArea>
      <Header title="Settings" />
      <ProfilePicContainer>
        <TouchableOpacity>
          <DefaultProfilePic
            label={user ? user.email.charAt(0).toUpperCase() : "NULL"}
          />
        </TouchableOpacity>
      </ProfilePicContainer>
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
