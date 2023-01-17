import { View, Text, Button, TouchableOpacity } from "react-native";
import React, { createRef, useState } from "react";
import { Camera, CameraType } from "expo-camera";
import {
  ProfileCamera,
  PermissionsContainer,
  PermissionsText,
} from "./CameraStyles";
import AuthenticationContext from "../../../hooks/authentication/authenticationContext";

const CameraScreen = ({ navigation }: any) => {
  const [type, setType] = useState(CameraType.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { user }: AuthContextInterface = authContext;

  const cameraRef = createRef<Camera>();

  const snap = async () => {
    if (cameraRef) {
      const photo =
        cameraRef.current && (await cameraRef.current.takePictureAsync());
      navigation.navigate("Settings", { photo });
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View>
        <Text>No Access to Camera</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <PermissionsContainer>
        <PermissionsText>
          We need your permission to show the camera
        </PermissionsText>
        <Button onPress={requestPermission} title="Grant permission" />
      </PermissionsContainer>
    );
  }
  return (
    <TouchableOpacity onPress={snap}>
      <ProfileCamera ref={cameraRef} type={type} ratio={"16:9"} />
    </TouchableOpacity>
  );
};

export default CameraScreen;
