import React, { ReactNode } from "react";
import {
  Chevron,
  GoBackButton,
  HeaderContainer,
  NavContainer,
  Title,
} from "./headerStyles";
import { useNavigation } from "@react-navigation/core";

interface Props {
  title?: ReactNode;
}

const Header = ({ title }: Props) => {
  const navigation = useNavigation();
  return (
    <HeaderContainer>
      <NavContainer>
        <GoBackButton onPress={() => navigation.goBack()}>
          <Chevron />
        </GoBackButton>
        <Title>{title}</Title>
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header;
