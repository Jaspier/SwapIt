import styled from "styled-components";
import { colors } from "../../theme/colors";
import { View, Text, Pressable, Image } from "react-native";

export const DisplayName = styled(Text)`
  text-align: center;
  font-size: 20px;
  line-height: 28px;
  color: ${colors.text.primary};
  padding-bottom: 16px;
  font-weight: 700;
`;

export const DetailsContainer = styled(View)`
  margin-bottom: 35px;
`;

export const ImagePickerPressable = styled(Pressable)`
  background-color: ${colors.bg.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-vertical: 5px;
  margin-left: 132px;
  height: 130px;
  width: 130px;
  border-width: 1px;
  border-style: dashed;
  border-radius: 30px;
`;

export const MaxImagesText = styled(Text)`
  text-align: center;
  font-size: 14px;
  line-height: 20px;
  color: ${colors.text.disabled};
  padding-vertical: 8px;
  font-weight: 700;
`;

export const SelectedImages = styled(Image)`
  width: 150px;
  height: 150px;
  margin-right: 10px;
`;
