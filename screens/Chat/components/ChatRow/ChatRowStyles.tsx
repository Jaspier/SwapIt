import styled from "styled-components";
import { colors } from "../../../../theme/colors";
import { Text, Image, TouchableOpacity, View } from "react-native";

export const Row = styled(TouchableOpacity)<{ deactivated: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 20px;
  background-color: ${colors.bg.primary};
  margin: 4px 12px;
  border-radius: 8px;
  box-shadow: 0px 1px rgba(0, 0, 0, 0.2);
  opacity: ${(props) => (props.deactivated ? 0.5 : 1)};
`;

export const PreviewContainer = styled(View)`
  overflow: hidden;
  width: 75%;
`;

export const ProfileImage = styled(Image)`
  border-radius: 9999px;
  width: 64px;
  height: 64px;
  margin-right: 16px;
`;

export const ProfileDisplayName = styled(Text)`
  font-size: 18px;
  line-height: 28px;
  font-weight: 600;
`;

export const ProfileItemName = styled(Text)`
  font-size: 14px;
  line-height: 20px;
`;
