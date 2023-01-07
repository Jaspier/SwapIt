import { Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  NoProfilesText,
  NoProfilesImage,
  NoProfilesCard,
} from "./homeStyles";
import { AntDesign, Ionicons, Entypo } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { CLOUD_FRONT_API_ENDPOINT } from "@env";

const HomeScreen = ({ navigation }: any) => {
  const authContext = AuthenticationContext();
  const [profiles, setProfiles] = useState<{ id: string }[]>([]);
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

  useEffect(() => {
    let unsub;

    const fetchCards = async () => {
      if (user) {
        unsub = onSnapshot(collection(db, "users"), (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        });
      }
    };

    fetchCards();
    return unsub;
  }, [db]);

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
          cards={profiles}
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
          renderCard={(card: any) =>
            card ? (
              <Card key={card.id}>
                <CardImage
                  source={{
                    uri: `${CLOUD_FRONT_API_ENDPOINT}/fit-in/1000x1000/public/${
                      JSON.parse(card.photoUrls)[0].uri
                    }`,
                  }}
                />
                <CardFooter>
                  <View>
                    <ItemName>{card.itemName}</ItemName>
                    <Text>{card.displayName}</Text>
                  </View>
                  <Location>{card.location}</Location>
                </CardFooter>
              </Card>
            ) : (
              <NoProfilesCard>
                <NoProfilesText>No more profiles</NoProfilesText>
                <NoProfilesImage
                  source={require("../../assets/Crying_Face_Emoji_large.webp")}
                />
              </NoProfilesCard>
            )
          }
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
