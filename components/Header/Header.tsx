import React, { ReactNode } from "react";
import {
  Chevron,
  GoBackButton,
  HeaderContainer,
  HeaderTextContainer,
  NavContainer,
  NFCButton,
  SettingsButton,
  SubHeading,
  Title,
} from "./headerStyles";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  title?: ReactNode;
  subheading?: ReactNode;
  nfc?: ReactNode;
  isNewUser?: ReactNode;
  settings?: ReactNode;
  matchDetails?: ReactNode;
}

const Header = ({
  title,
  subheading,
  nfc,
  isNewUser,
  settings,
  matchDetails,
}: Props) => {
  const navigation: NavigationProp<any> = useNavigation();
  return (
    <HeaderContainer>
      <NavContainer>
        {!isNewUser && (
          <GoBackButton onPress={() => navigation.goBack()}>
            <Chevron />
          </GoBackButton>
        )}
        <HeaderTextContainer>
          <Title>{title}</Title>
          {subheading && <SubHeading>{subheading}</SubHeading>}
        </HeaderTextContainer>
      </NavContainer>
      {nfc && (
        <NFCButton
          onPress={() =>
            navigation.navigate("Swap", {
              matchDetails,
            })
          }
        >
          <MaterialIcons name="nfc" size={20} color="green" />
        </NFCButton>
      )}
      {settings && (
        <SettingsButton onPress={() => navigation.navigate("Settings")}>
          <MaterialIcons name="settings" size={30} color="grey" />
        </SettingsButton>
      )}
    </HeaderContainer>
  );
};

export default Header;
