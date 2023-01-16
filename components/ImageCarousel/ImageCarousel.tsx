import { Pressable } from "react-native";
import React, { useState } from "react";
import { CLOUD_FRONT_API_ENDPOINT } from "@env";
import { CardImage, Pagination, PaginationDot } from "./ImageCarouselStyles";

type imageObj = {
  uri: string;
};

type Props = {
  images: imageObj[];
};

const ImageCarousel = ({ images }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

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
          uri: `${CLOUD_FRONT_API_ENDPOINT}/fit-in/1000x1000/public/${images[activeIndex].uri}`,
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
