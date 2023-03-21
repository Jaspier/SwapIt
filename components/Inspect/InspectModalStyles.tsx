import styled from "styled-components";
import { View, Image } from "react-native";
import { Avatar } from "react-native-paper";
import { colors } from "../../theme/colors";

export const CardContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ZoomedImage = styled(Image)`
  height: 60%;
  width: 60%;
`;

export const ZoomedProfilePic = styled(Image)`
  height: 300px;
  width: 300px;
  border-radius: 9999px;
`;

export const ZoomedDefaultProfileIcon = styled(Avatar.Text).attrs({
  size: 300,
})`
  background-color: ${colors.bg.account};
`;
