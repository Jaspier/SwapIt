import styled from "styled-components";
import { colors } from "../../theme/colors";
import { View, Text, Pressable, Image } from "react-native";

export const DisplayName = styled(Text)`
  text-align: center;
  font-size: ${(props) => props.theme.fontSizes.title};
  line-height: ${(props) => props.theme.lineHeights.title};
  color: ${colors.text.primary};
  padding-bottom: ${(props) => props.theme.space[4]};
  font-weight: ${(props) => props.theme.fontWeights.bold};
`;

export const DetailsContainer = styled(View)`
  margin-bottom: ${(props) => props.theme.space[6]};
`;

export const ImagePickerPressable = styled(Pressable)`
  background-color: ${colors.bg.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-vertical: ${(props) => props.theme.space[1]};
  margin-left: ${(props) => props.theme.space[8]};
  height: 130px;
  width: 130px;
  border-width: 1px;
  border-style: dashed;
  border-radius: 30px;
`;

export const MaxImagesText = styled(Text)`
  text-align: center;
  font-size: ${(props) => props.theme.fontSizes.caption};
  line-height: ${(props) => props.theme.lineHeights.copy};
  color: ${colors.text.disabled};
  padding-vertical: ${(props) => props.theme.space[2]};
  font-weight: ${(props) => props.theme.fontWeights.bold};
`;

export const SelectedImages = styled(Image)`
  width: 150px;
  height: 150px;
  margin-right: ${(props) => props.theme.space[2]};
`;
