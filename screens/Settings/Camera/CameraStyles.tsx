import styled from "styled-components";
import { Camera } from "expo-camera";
import { View, Text } from "react-native";

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
