import { View, Text } from "react-native";
import React from "react";
import { Card, CardFooter, ItemName, LocationText } from "./ProfileCardStyles";
import ImageCarousel from "../ImageCarousel/ImageCarousel";

const ProfileCard = ({ matchedUserDetails, modal }: any) => {
  return (
    <Card modal={modal}>
      <ImageCarousel images={JSON.parse(matchedUserDetails.photoUrls)} />
      <CardFooter>
        <View>
          <ItemName>{matchedUserDetails.itemName}</ItemName>
          <Text>{matchedUserDetails.displayName}</Text>
        </View>
        <LocationText>{matchedUserDetails.location}</LocationText>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
