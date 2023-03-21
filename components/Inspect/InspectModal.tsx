import React from "react";
import {
  CardContainer,
  ZoomedImage,
  ZoomedProfilePic,
} from "./InspectModalStyles";
import { useRoute } from "@react-navigation/core";
import { TouchableWithoutFeedback } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import ProfileCard from "../ProfileCard/ProfileCard";
import { CLOUD_FRONT_API_ENDPOINT } from "@env";

const InspectModal = () => {
  const navigation: NavigationProp<any> = useNavigation();
  const { params } = useRoute();
  //@ts-ignore
  const { matchedUserDetails, photo, profilePic } = params;
  return (
    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
      <CardContainer>
        {profilePic && (
          <ZoomedProfilePic
            source={{
              uri: `${CLOUD_FRONT_API_ENDPOINT}/fit-in/1000x1000/public/profiles/${profilePic.userId}/${profilePic.key}`,
            }}
          />
        )}
        {matchedUserDetails && (
          <ProfileCard userProfile={matchedUserDetails} modal />
        )}
        {photo && (
          <ZoomedImage
            source={{
              uri: `${CLOUD_FRONT_API_ENDPOINT}/fit-in/1000x1000/public/chats/${photo.matchId}/${photo.key}`,
            }}
          />
        )}
      </CardContainer>
    </TouchableWithoutFeedback>
  );
};

export default InspectModal;
