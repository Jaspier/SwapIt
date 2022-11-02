import { StatusBar, SafeAreaView, View } from "react-native";
import styled from "styled-components";

export const SafeArea = styled(SafeAreaView)`
  flex: 1;
  ${StatusBar.currentHeight && `margin-top: ${StatusBar.currentHeight}px`};
`;

export const FullArea = styled(View)`
  flex: 1;
`;

export const Spacer = styled(View)`
  height: 20px;
`;
