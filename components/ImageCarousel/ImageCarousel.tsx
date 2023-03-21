import { Pressable } from "react-native";
import React, { useState } from "react";
import { CLOUD_FRONT_API_ENDPOINT } from "@env";
import { CardImage, Pagination, PaginationDot } from "./ImageCarouselStyles";
import { MatchedUser } from "../../types";

type imageObj = {
  uri: string;
};

type Props = {
  userProfile: MatchedUser;
};

const ImageCarousel = ({ userProfile }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const images: imageObj[] = JSON.parse(userProfile.photoUrls);

  const nextImage = () => {
    if (activeIndex === images.length - 1) {
      setActiveIndex(0);
    } else {
      setActiveIndex(activeIndex + 1);
    }
  };

  return (
    <Pressable onPress={nextImage}>
      <CardImage
        source={{
          uri: `${CLOUD_FRONT_API_ENDPOINT}/fit-in/1000x1000/public/profiles/${userProfile.id}/items/${images[activeIndex].uri}`,
        }}
      />
      <Pagination>
        {images.map((_, index) => (
          <PaginationDot key={index} active={index === activeIndex} />
        ))}
      </Pagination>
    </Pressable>
  );
};

export default ImageCarousel;
