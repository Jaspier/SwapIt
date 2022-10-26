import { StatusBar, SafeAreaView, View, Text } from "react-native";
import styled from "styled-components";

export const SafeArea = styled(SafeAreaView)`
  flex: 1;
  ${StatusBar.currentHeight && `margin-top: ${StatusBar.currentHeight}px`};
  background-color: #fff;
`;

export const FullArea = styled(View)`
  flex: 1;
`;

export const ErrorText = styled(Text)`
  color: ${(props) => props.theme.colors.text.error};
`;
