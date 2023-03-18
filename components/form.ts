import styled from "styled-components";
import { colors } from "../theme/colors";
import { View, Text, TouchableOpacity, TextInput } from "react-native";

export const Label = styled(Text)`
  text-align: center;
  padding: ${(props) => props.theme.space[4]};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  color: ${colors.brand.primary};
`;

export const Input = styled(TextInput)`
  text-align: center;
  font-size: ${(props) => props.theme.fontSizes.title};
  line-height: ${(props) => props.theme.lineHeights.title};
  padding-bottom: ${(props) => props.theme.space[2]};
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
  padding: ${(props) => props.theme.space[3]};
  border-radius: ${(props) => props.theme.sizes[1]};
  position: absolute;
  bottom: ${(props) => props.theme.space[5]};
  background-color: ${(props) =>
    props.disabled ? colors.ui.disabled : colors.brand.primary};
`;

export const ButtonText = styled(Text)`
  text-align: center;
  color: ${colors.text.inverse};
  font-size: ${(props) => props.theme.fontSizes.title};
  line-height: ${(props) => props.theme.lineHeights.title};
`;
