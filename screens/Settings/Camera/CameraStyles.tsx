import styled from "styled-components";
import { Camera } from "expo-camera";
import { View, Text, TouchableOpacity } from "react-native";
import { colors } from "../../../theme/colors";

export const ProfileCamera = styled(Camera)`
  width: 100%;
  height: 100%;
`;

export const PermissionsContainer = styled(View)`
  flex: 1;
  justify-content: center;
`;

export const PermissionsText = styled(Text)`
  text-align: center;
`;

export const FooterContainer = styled(View)`
  position: absolute;
  justify-content: center;
  align-items: center;
  bottom: 0;
  height: 15%;
  width: 100%;
  background-color: ${colors.bg.black};
`;

export const CameraButton = styled(TouchableOpacity)`
  width: 60px;
  height: 60px;
  border-radius: 9999px;
  background-color: ${colors.bg.primary};
  align-items: center;
  justify-content: center;
  shadow-color: ${colors.bg.black};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.5;
  shadow-radius: 2px;
  elevation: 3;
`;

export const CameraButtonInner = styled(View)`
  width: 50px;
  height: 50px;
  border-radius: 9999px;
  background-color: ${colors.bg.black};
  align-items: center;
  justify-content: center;
`;

export const CameraButtonIcon = styled(View)`
  width: 45px;
  height: 45px;
  border-radius: 9999px;
  background-color: ${colors.bg.primary};
`;

export const ReverseCameraContainer = styled(TouchableOpacity)`
  position: absolute;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  border-radius: 9999px;
  background-color: ${colors.ui.dark};
  right: 10%;
`;
