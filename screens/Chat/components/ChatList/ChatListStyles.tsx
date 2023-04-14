import styled from "styled-components";
import { View, Text } from "react-native";
import { colors } from "../../../../theme/colors";

export const NoMatchesContainer = styled(View)`
  padding: ${(props) => props.theme.space[5]};
`;
export const NoPartnersText = styled(Text)`
  text-align: center;
  font-size: ${(props) => props.theme.fontSizes.default};
  line-height: ${(props) => props.theme.lineHeights.title};
`;

export const DeleteSlider = styled(View)`
  background-color: ${colors.ui.error};
  align-items: center;
  justify-content: center;
  align-self: center;
  width: 85px;
  height: 85px;
`;

export const DeleteText = styled(Text)`
  color: ${colors.text.inverse};
  font-weight: ${(props) => props.theme.fontWeights.bold};
`;
