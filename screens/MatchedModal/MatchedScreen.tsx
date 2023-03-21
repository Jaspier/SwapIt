import React, { useContext, useEffect } from "react";
import { useRoute } from "@react-navigation/core";
import { CLOUD_FRONT_API_ENDPOINT } from "@env";
import {
  ChatButton,
  ChatButtonText,
  Header,
  HeaderContainer,
  ImagesContainer,
  MatchedContainer,
  ProfileImage,
  Subheader,
  TouchableContainer,
} from "./MatchedStyles";
import Toast from "react-native-toast-message";
import { NotificationContext } from "../../hooks/notifications/notificationContext";

const MatchedScreen = ({ navigation }: any) => {
  const { params } = useRoute();

  // @ts-ignore
  const { loggedInProfile, userSwiped, matchDetails } = params;
  const { notifications, removeNotification } = useContext(NotificationContext);
  return (
    <TouchableContainer
      onPress={() => {
        navigation.goBack();
        Toast.hide();
        removeNotification(notifications[0]);
      }}
    >
      <MatchedContainer>
        <HeaderContainer>
          <Header>Let's Get Swapping!</Header>
        </HeaderContainer>
        <Subheader>You and {userSwiped.displayName} want to swap.</Subheader>
        <ImagesContainer>
          <ProfileImage
            source={{
              uri: `${CLOUD_FRONT_API_ENDPOINT}/fit-in/400x400/public/profiles/${
                loggedInProfile.id
              }/items/${JSON.parse(loggedInProfile.photoUrls)[0].uri}`,
            }}
          />
          <ProfileImage
            source={{
              uri: `${CLOUD_FRONT_API_ENDPOINT}/fit-in/400x400/public/profiles/${
                userSwiped.id
              }/items/${JSON.parse(userSwiped.photoUrls)[0].uri}`,
            }}
          />
        </ImagesContainer>
        <ChatButton
          onPress={() => {
            navigation.goBack();
            navigation.navigate("Message", {
              matchDetails,
            });
          }}
        >
          <ChatButtonText>Send a Message</ChatButtonText>
        </ChatButton>
      </MatchedContainer>
    </TouchableContainer>
  );
};

export default MatchedScreen;
