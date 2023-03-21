import { View, Text } from "react-native";
import React from "react";
import { Card, CardFooter, ItemName, LocationText } from "./ProfileCardStyles";
import ImageCarousel from "../ImageCarousel/ImageCarousel";
import { MatchedUser } from "../../types";

interface ProfileCardProps {
  userProfile: MatchedUser;
  modal: boolean;
}

const ProfileCard = ({ userProfile, modal }: ProfileCardProps) => {
  return (
    <Card modal={modal}>
      <ImageCarousel userProfile={userProfile} />
      <CardFooter>
        <View>
          <ItemName>{userProfile.itemName}</ItemName>
          <Text>{userProfile.displayName}</Text>
        </View>
        <LocationText>{userProfile.location}</LocationText>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
