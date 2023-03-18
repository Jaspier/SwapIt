import styled from "styled-components";
import { colors } from "../../theme/colors";
import { View, Text } from "react-native";

export const SwappedContainer = styled(View)`
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

export const SwappedText = styled(Text)`
  position: absolute;
  top: 22%;
  font-size: ${(props) => props.theme.fontSizes.h3};
  color: ${colors.text.inverse};
  font-weight: ${(props) => props.theme.fontWeights.semiBold};
`;

export const AnimationContainer = styled(View)`
  width: 250px;
  height: 250px;
`;
