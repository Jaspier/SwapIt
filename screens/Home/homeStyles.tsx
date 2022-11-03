import styled from "styled-components";
import { colors } from "../../theme/colors";
import { Avatar } from "react-native-paper";
import { View, Text, Image } from "react-native";
import Swiper from "react-native-deck-swiper";

export const HeaderContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between
  position: relative;
  padding-left: 20px;
  padding-right: 20px;
`;

export const AvatarIcon = styled(Avatar.Text).attrs({
  size: 40,
})`
  background-color: ${colors.bg.account};
`;

export const Logo = styled(Text)`
  font-size: 25px;
  font-weight: 500;
  color: ${colors.brand.primary};
`;

export const SwiperContainer = styled(View)`
  flex: 1;
  margin-top: -24px;
`;

export const DeckSwiper = styled(Swiper).attrs({
  containerStyle: { backgroundColor: "transparent" },
})``;

export const Card = styled(View)`
  position: relative;
  background-color: white;
  height: 75%;
  border-radius: 12px;
  box-shadow: 0px 1px rgba(0, 0, 0, 0.2);
`;

export const CardImage = styled(Image)`
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  border-radius: 12px;
`;

export const CardFooter = styled(View)`
  position: absolute;
  flex-direction: row;
  bottom: 0;
  background-color: white;
  width: 100%;
  height: 80px;
  justify-content: space-between;
  align-items: center;
  padding: 8px 24px;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`;

export const ItemName = styled(Text)`
  font-size: 20px;
  line-height: 28px;
  font-weight: 700;
`;

export const Location = styled(Text)`
  font-size: 16px;
  line-height: 32px;
  font-weight: 700;
`;
