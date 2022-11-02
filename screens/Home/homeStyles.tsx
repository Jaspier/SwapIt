import styled from "styled-components";
import { colors } from "../../theme/colors";
import { Avatar } from "react-native-paper";

export const AvatarPressable = styled(Avatar.Text).attrs({
  size: 48,
})`
  background-color: ${colors.bg.account};
`;
