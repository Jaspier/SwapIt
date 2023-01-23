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
  font-size: 36px;
  color: ${colors.bg.brand};
  font-weight: semi-bold;
`;

export const ConfirmedTextContainer = styled(View)`
  position: absolute;
  top: 120px;
  padding-horizontal: 10px;
`;

export const ConfirmedText = styled(Text)`
  font-size: 28px;
  font-weight: semi-bold;
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
  padding: 10px;
  border-radius: 10px;
`;

export const CancelText = styled(Text)`
  color: ${colors.text.inverse};
  font-size: 18px;
`;
