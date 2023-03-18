import styled from "styled-components";
import { View, Text } from "react-native";

export const NoMatchesContainer = styled(View)`
  padding: 20px;
`;
export const NoMatchesText = styled(Text)`
  text-align: center;
  font-size: 18px;
  line-height: 28px;
`;

export const DeleteSlider = styled(View)`
  background-color: red;
  align-items: center;
  justify-content: center;
  align-self: center;
  width: 85px;
  height: 85px;
`;

export const DeleteText = styled(Text)`
  color: white;
  font-weight: bold;
`;
