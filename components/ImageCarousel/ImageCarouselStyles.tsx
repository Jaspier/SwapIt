import styled from "styled-components";
import { colors } from "../../theme/colors";
import { Image, View } from "react-native";

export const CardImage = styled(Image)`
  height: 100%;
  width: 100%;
  border-radius: 12px;
`;

export const Pagination = styled(View)`
  height: 20%;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  bottom: 50px;
  align-self: center;
`;
export const PaginationDot = styled(View)<{
  active: boolean;
}>`
  height: 10px;
  width: 10px;
  border-radius: 9999px;
  background-color: ${colors.bg.primary};
  opacity: ${(props) => (props.active ? 1 : 0.5)};
  margin: 5px;
`;
