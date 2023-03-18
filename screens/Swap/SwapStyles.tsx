import styled from "styled-components";
import { colors } from "../../theme/colors";
import { View, TouchableOpacity, Text } from "react-native";

export const SwapContainer = styled(View)`
  position: absolute;
  background-color: ${colors.bg.brand};
  opacity: 0.8;
  margin: 0 auto;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`;

export const SwapButton = styled(TouchableOpacity)`
  background-color: ${colors.bg.primary};
  height: 200px;
  width: 200px;
  border-radius: 9999px;
  justify-content: center;
  align-items: center;
`;

export const SwapText = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes.h4};
  color: ${colors.bg.brand};
  font-weight: ${(props) => props.theme.fontWeights.semiBold};
`;

export const ConfirmedTextContainer = styled(View)`
  position: absolute;
  top: ${(props) => props.theme.space[8]};
  padding-horizontal: ${(props) => props.theme.space[3]};
`;

export const ConfirmedText = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes.h5};
  font-weight: ${(props) => props.theme.fontWeights.semiBold};
  color: ${colors.text.inverse};
`;

export const DisclaimerTextContainer = styled(View)`
  position: absolute;
  bottom: ${(props) => props.theme.space[7]};
  padding-horizontal: ${(props) => props.theme.space[5]};
`;

export const DisclaimerText = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  color: ${colors.text.inverse};
`;

export const CancelButton = styled(TouchableOpacity)`
  position: absolute;
  bottom: 10%;
  width: 150px;
  height: 50px;
  background-color: ${colors.ui.error};
  justify-content: center;
  align-items: center;
  padding: ${(props) => props.theme.space[2]};
  border-radius: ${(props) => props.theme.space[2]};
`;

export const CancelText = styled(Text)`
  color: ${colors.text.inverse};
  font-size: ${(props) => props.theme.fontSizes.title};
`;
