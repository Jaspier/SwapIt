import { Text, TouchableOpacity, View } from "react-native";
import React, { useLayoutEffect, useRef } from "react";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import { SafeArea } from "../../components/utilities";
import {
  HeaderContainer,
  AvatarIcon,
  Logo,
  DeckSwiper,
  SwiperContainer,
  Card,
  CardImage,
  CardFooter,
  ItemName,
  Location,
  SwipeButtonsContainer,
  SwipeButton,
} from "./homeStyles";
import { AntDesign, Ionicons, Entypo } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const DUMMY_DATA = [
  {
    id: 1,
    displayName: "Allen Dungo",
    itemName: "Variegated Monstera",
    location: "Antrim",
    photoURLs: [
      "http://static1.squarespace.com/static/5a032c682278e74417b38113/t/5d3647e5339e9100019b9557/1563838454790/monvar.jpg?format=1500w",
    ],
  },
  {
    id: 2,
    displayName: "Jasper Davidson",
    itemName: "Golden Pothos",
    location: "Belfast",
    photoURLs: ["https://media.bunches.co.uk/products/ptempp-1.jpg"],
  },
  {
    id: 3,
    displayName: "Olivia Craig",
    itemName: "Succulent",
    location: "Ballymena",
    photoURLs: [
      "https://www.bhg.com/thmb/CV-IdGD-c0WFMRCsFgj-_tUnelo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/panda-plant-ee6cc069-72de16b817654cfe944b1f3055420f3e.jpg",
    ],
  },
];

const HomeScreen = ({ navigation }: any) => {
  const authContext = AuthenticationContext();
  const swipeRef = useRef<any>(null);
  if (!authContext) {
    return null;
  }
  const { user }: AuthContextInterface = authContext;

  useLayoutEffect(() => {
    if (user) {
      onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        if (!snapshot.exists()) {
          navigation.navigate("Profile");
        }
      });
    }
  }, [user, navigation]);

  return (
    <SafeArea>
      {/* Start of Header */}
      <HeaderContainer>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <AvatarIcon
            label={user ? user.email.charAt(0).toUpperCase() : "NULL"}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Logo>SwapIt</Logo>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons
            name="chatbubbles-sharp"
            size={30}
            color={colors.brand.primary}
          />
        </TouchableOpacity>
      </HeaderContainer>
      {/* End of Header */}

      {/* Start of Cards Section */}
      <SwiperContainer>
        <DeckSwiper
          ref={swipeRef}
          cards={DUMMY_DATA}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          onSwipedLeft={() => {
            console.log("Swipe NOPE");
          }}
          onSwipedRight={() => {
            console.log("Swipe SWAPIT!");
          }}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "SWAPIT",
              style: {
                label: {
                  color: colors.brand.primary,
                },
              },
            },
          }}
          renderCard={(card: any) => (
            <Card key={card.id}>
              <CardImage source={{ uri: card.photoURLs[0] }} />

              <CardFooter>
                <View>
                  <ItemName>{card.itemName}</ItemName>
                  <Text>{card.displayName}</Text>
                </View>
                <Location>{card.location}</Location>
              </CardFooter>
            </Card>
          )}
        />
      </SwiperContainer>
      {/* End of Cards Section */}

      {/* Start of swipe buttons */}
      <SwipeButtonsContainer>
        <SwipeButton
          type="cross"
          onPress={() =>
            swipeRef.current ? swipeRef?.current.swipeLeft() : {}
          }
        >
          <Entypo name="cross" size={24} color="red" />
        </SwipeButton>
        <SwipeButton
          type="swap"
          onPress={() =>
            swipeRef.current ? swipeRef?.current.swipeRight() : {}
          }
        >
          <AntDesign name="swap" size={24} color="green" />
        </SwipeButton>
      </SwipeButtonsContainer>
      {/* End of swipe buttons */}
    </SafeArea>
  );
};

export default HomeScreen;
