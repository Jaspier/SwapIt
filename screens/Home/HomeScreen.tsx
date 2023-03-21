import { TouchableOpacity } from "react-native";
import React, { useContext, useRef, useState } from "react";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import { SafeArea } from "../../components/utilities";
import {
  HeaderContainer,
  Logo,
  DeckSwiper,
  SwiperContainer,
  SwipeButtonsContainer,
  SwipeButton,
  NoProfilesText,
  NoProfilesImage,
  NoProfilesCard,
  DefaultAccountIcon,
  AccountImage,
} from "./homeStyles";
import { AntDesign, Ionicons, Entypo } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { CLOUD_FRONT_API_ENDPOINT } from "@env";
import { useRoute, useIsFocused } from "@react-navigation/native";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import { Profile } from "../../types";
import Toast from "react-native-toast-message";
import { NotificationContext } from "../../hooks/notifications/notificationContext";
import {
  useCheckProfileCompletion,
  useFetchCards,
  swipeLeft,
  swipeRight,
} from "./homeHelpers";
import { useGetUserLocation, useNotificationHandler } from "../../helpers";

const HomeScreen = ({ navigation }: any) => {
  const isFocused = useIsFocused();
  const { notifications, removeNotification } = useContext(NotificationContext);
  const authContext = AuthenticationContext();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const swipeRef = useRef<any>(null);
  if (!authContext) {
    return null;
  }
  const { user }: AuthContextInterface = authContext;

  const { params } = useRoute();

  useCheckProfileCompletion(user, navigation);

  useNotificationHandler(
    notifications,
    navigation,
    removeNotification,
    Toast,
    isFocused
  );

  useGetUserLocation(user, false, false);

  useFetchCards(user, params, setProfiles);

  return (
    <SafeArea>
      {/* Start of Header */}
      <HeaderContainer>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          {user && user.photoURL ? (
            <AccountImage
              source={{
                uri: `${CLOUD_FRONT_API_ENDPOINT}/fit-in/400x400/public/profiles/${user.uid}/${user.photoURL}`,
              }}
            />
          ) : (
            <DefaultAccountIcon
              label={user ? user.email.charAt(0).toUpperCase() : "NULL"}
            />
          )}
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
          onSwipedLeft={(cardIndex) => {
            user &&
              swipeLeft(user.stsTokenManager.accessToken, cardIndex, profiles);
          }}
          onSwipedRight={(cardIndex) => {
            user &&
              swipeRight(
                user.stsTokenManager.accessToken,
                cardIndex,
                profiles,
                navigation
              );
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
              <ProfileCard
                modal={false}
                key={card.id}
                matchedUserDetails={card}
              />
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
      <Toast />
    </SafeArea>
  );
};

export default HomeScreen;
