import {
  View,
  ImageBackground,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import styled from "styled-components";
import { Button, TextInput } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";

export const AuthBackground = styled(ImageBackground).attrs({
  source: require("../../../assets/gradient.jpeg"),
  resizeMode: "cover",
})`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Title = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes.h2};
  font-weight: ${(props) => props.theme.fontWeights.semiBold};
  color: ${colors.text.inverse};
`;

export const SplashButton = styled(TouchableOpacity)`
  position: absolute;
  bottom: 15%;
  width: 50%;
  background-color: ${colors.bg.primary};
  padding: ${(props) => props.theme.space[4]};
  border-radius: 30%;
`;

export const SplashText = styled(Text)`
  font-weight: ${(props) => props.theme.fontWeights.semiBold};
  text-align: center;
`;

export const AuthKeyboardAvoidingView = styled(KeyboardAvoidingView)`
  flex: 1 1 0%;
`;

export const AuthContainer = styled(View)`
  background-color: rgba(255, 255, 255, 0.4);
  padding: ${(props) => props.theme.space[6]};
  margin-top: ${(props) => props.theme.space[2]};
  align-items: center;
`;

export const AuthButton = styled(Button).attrs({
  color: colors.ui.auth,
})`
  padding: ${(props) => props.theme.space[2]};
  margin-top: ${(props) => props.theme.space[6]};
`;

export const PasswordContainer = styled(View)`
  flex-direction: row;
  align-items: center;
`;

export const AuthInput = styled(TextInput)`
  width: 300px;
  background-color: transparent;
`;

export const EyeContainer = styled(TouchableOpacity)`
  position: absolute;
  right: 10px;
  bottom: 10px;
`;

export const Eye = styled(Entypo)`
  color: ${colors.text.disabled};
`;

export const ErrorContainer = styled(View)`
  max-width: 300px;
  align-items: center;
  align-self: center;
  margin-top: ${(props) => props.theme.space[2]};
  margin-bottom: ${(props) => props.theme.space[2]};
`;
