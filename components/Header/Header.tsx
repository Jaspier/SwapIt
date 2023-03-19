import React from "react";
import {
  Chevron,
  GoBackButton,
  HeaderContainer,
  HeaderTextContainer,
  NavContainer,
  NFCButton,
  SettingsButton,
  StatusIndicator,
  StatusText,
  SubHeading,
  Title,
  TitleContainer,
} from "./headerStyles";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import { MaterialIcons } from "@expo/vector-icons";
import { Match, MatchedUser } from "../../types";
import { TouchableWithoutFeedback } from "react-native";

interface Props {
  title: string;
  subheading?: string;
  nfc?: boolean;
  status?: string;
  lastOnline?: string;
  isNewUser?: boolean | null | undefined;
  settings?: boolean;
  matchDetails?: Match;
  matchedUserDetails?: MatchedUser;
}

const Header = ({
  title,
  subheading,
  nfc,
  status,
  lastOnline,
  isNewUser,
  settings,
  matchDetails,
  matchedUserDetails,
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
          <TitleContainer>
            <Title>{title}</Title>
            {status && (
              <>
                <StatusIndicator status={status} />
                <StatusText numberOfLines={1} ellipsizeMode="tail">
                  {status}
                  {status === "offline" && `: ${lastOnline}`}
                </StatusText>
              </>
            )}
          </TitleContainer>
          {subheading && (
            <TouchableWithoutFeedback
              onPress={() =>
                matchedUserDetails &&
                navigation.navigate("MatchDetails", {
                  matchedUserDetails,
                })
              }
            >
              <SubHeading>{subheading}</SubHeading>
            </TouchableWithoutFeedback>
          )}
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
      {settings && !isNewUser && (
        <SettingsButton onPress={() => navigation.navigate("Settings")}>
          <MaterialIcons name="settings" size={30} color="grey" />
        </SettingsButton>
      )}
    </HeaderContainer>
  );
};

export default Header;
