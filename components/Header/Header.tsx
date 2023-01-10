import React, { ReactNode } from "react";
import {
  Chevron,
  GoBackButton,
  HeaderContainer,
  HeaderTextContainer,
  NavContainer,
  NFCButton,
  SubHeading,
  Title,
} from "./headerStyles";
import { useNavigation } from "@react-navigation/core";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  title?: ReactNode;
  subheading?: ReactNode;
  nfc?: ReactNode;
}

const Header = ({ title, subheading, nfc }: Props) => {
  const navigation = useNavigation();
  return (
    <HeaderContainer>
      <NavContainer>
        <GoBackButton onPress={() => navigation.goBack()}>
          <Chevron />
        </GoBackButton>
        <HeaderTextContainer>
          <Title>{title}</Title>
          {subheading && <SubHeading>{subheading}</SubHeading>}
        </HeaderTextContainer>
      </NavContainer>
      {nfc && (
        <NFCButton>
          <MaterialIcons name="nfc" size={20} color="green" />
        </NFCButton>
      )}
    </HeaderContainer>
  );
};

export default Header;
