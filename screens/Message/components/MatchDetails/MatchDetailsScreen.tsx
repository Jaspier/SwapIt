import React from "react";
import { CardContainer } from "./MatchDetailsStyles";
import { useRoute } from "@react-navigation/core";
import { TouchableWithoutFeedback } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import ProfileCard from "../../../../components/ProfileCard/ProfileCard";

const MatchDetailsScreen = () => {
  const navigation: NavigationProp<any> = useNavigation();
  const { params } = useRoute();
  //@ts-ignore
  const { matchedUserDetails } = params;
  return (
    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
      <CardContainer>
        <ProfileCard userProfile={matchedUserDetails} modal />
      </CardContainer>
    </TouchableWithoutFeedback>
  );
};

export default MatchDetailsScreen;
