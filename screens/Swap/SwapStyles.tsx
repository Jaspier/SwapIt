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
  background-color: white;
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
