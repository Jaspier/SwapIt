import styled from "styled-components";
import { View, Text } from "react-native";
import { colors } from "../../theme/colors";

export const Card = styled(View)<{ modal: boolean }>`
  position: relative;
  background-color: ${colors.bg.primary};
  width: ${(props) => (props.modal ? "90%" : "100%")};
  height: ${(props) => (props.modal ? "65%" : "75%")};
  border-radius: ${(props) => props.theme.sizes[1]};
  box-shadow: 0px 1px rgba(0, 0, 0, 0.2);
`;

export const CardFooter = styled(View)`
  position: absolute;
  flex-direction: row;
  bottom: 0;
  background-color: ${colors.bg.primary};
  width: 100%;
  height: 80px;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.space[2]} ${(props) => props.theme.space[5]};
  border-bottom-left-radius: ${(props) => props.theme.sizes[1]};
  border-bottom-right-radius: ${(props) => props.theme.space[1]};
`;

export const ItemName = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes.default};
  line-height: ${(props) => props.theme.lineHeights.title};
  font-weight: ${(props) => props.theme.fontWeights.bold};
`;

export const LocationText = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes.body};
  line-height: ${(props) => props.theme.lineHeights.title};
  font-weight: ${(props) => props.theme.fontWeights.bold};
`;
