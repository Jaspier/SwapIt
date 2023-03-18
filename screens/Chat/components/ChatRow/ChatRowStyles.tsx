import styled from "styled-components";
import { colors } from "../../../../theme/colors";
import { Text, Image, TouchableOpacity, View } from "react-native";

export const Row = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${(props) => props.theme.space[3]} ${(props) => props.theme.space[5]};
  background-color: ${colors.bg.primary};
  margin: ${(props) => props.theme.space[1]} ${(props) => props.theme.space[3]};
  border-radius: ${(props) => props.theme.sizes[0]};
  box-shadow: 0px 1px rgba(0, 0, 0, 0.2);
`;

export const PreviewContainer = styled(View)`
  overflow: hidden;
  width: 75%;
`;

export const ProfileImage = styled(Image)`
  border-radius: 9999px;
  width: 64px;
  height: 64px;
  margin-right: ${(props) => props.theme.space[4]};
`;

export const ProfileDisplayName = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes.default};
  line-height: ${(props) => props.theme.lineHeights.title};
  font-weight: ${(props) => props.theme.fontWeights.medium};
`;

export const ProfileItemName = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes.caption};
  line-height: ${(props) => props.theme.lineHeights.copy};
`;
