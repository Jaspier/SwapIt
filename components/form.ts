import styled from "styled-components";
import { colors } from "../theme/colors";
import { View, Text, TouchableOpacity, TextInput } from "react-native";

export const Label = styled(Text)`
  text-align: center;
  padding: 16px;
  font-weight: 700;
  color: ${colors.brand.primary};
`;

export const Input = styled(TextInput)`
  text-align: center;
  font-size: 20px;
  line-height: 28px;
  padding-bottom: 8px;
  background: transparent;
`;

export const ButtonContainer = styled(View)`
  flex: 1 1 0%;
  align-items: center;
`;

export const UpdateProfileButton = styled(TouchableOpacity)<{
  disabled: boolean;
}>`
  width: 256px;
  padding: 12px;
  border-radius: 12px;
  position: absolute;
  bottom: 20px;
  background-color: ${(props) =>
    props.disabled ? colors.ui.disabled : colors.brand.primary};
`;

export const ButtonText = styled(Text)`
  text-align: center;
  color: ${colors.text.inverse};
  font-size: 20px;
  line-height: 28px;
`;
