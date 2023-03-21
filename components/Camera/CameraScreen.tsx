import { View, Text, Button } from "react-native";
import React, { createRef, useState } from "react";
import { Camera, CameraType } from "expo-camera";
import {
  ProfileCamera,
  PermissionsContainer,
  PermissionsText,
  FooterContainer,
  CameraButton,
  CameraButtonInner,
  CameraButtonIcon,
  ReverseCameraContainer,
} from "./CameraStyles";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { useRoute } from "@react-navigation/core";

const CameraScreen = ({ navigation }: any) => {
  const [type, setType] = useState(CameraType.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const cameraRef = createRef<Camera>();

  const { params }: any = useRoute();

  const snap = async () => {
    if (cameraRef && params) {
      const photo =
        cameraRef.current && (await cameraRef.current.takePictureAsync());
      const { screen, matchDetails } = params;
      if (screen === "settings") {
        navigation.navigate("Settings", { photo });
      } else if (screen === "message") {
        navigation.navigate("Message", { photo, matchDetails });
      }
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

  const reverseCamera = () => {
    if (type === CameraType.front) {
      setType(CameraType.back);
    } else {
      setType(CameraType.front);
    }
  };

  return (
    <View>
      <ProfileCamera ref={cameraRef} type={type} ratio={"16:9"} />
      <FooterContainer>
        <CameraButton onPress={snap}>
          <CameraButtonInner>
            <CameraButtonIcon />
          </CameraButtonInner>
        </CameraButton>
        <ReverseCameraContainer onPress={reverseCamera}>
          <Ionicons
            name="camera-reverse-outline"
            size={24}
            color={colors.ui.light}
          />
        </ReverseCameraContainer>
      </FooterContainer>
    </View>
  );
};

export default CameraScreen;