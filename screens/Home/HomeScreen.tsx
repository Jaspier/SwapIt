import { TouchableOpacity } from "react-native";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import * as Location from "expo-location";
import { CLOUD_FRONT_API_ENDPOINT } from "@env";
import { getDistance } from "geolib";
import { useRoute, useIsFocused } from "@react-navigation/native";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import { Coords, Profile } from "../../types";
import Toast from "react-native-toast-message";
import { NotificationContext } from "../../hooks/notifications/notificationContext";
import generateId from "../../lib/generateId";
import {
  checkUserExists,
  getSearchPreferences,
  like,
  pass,
  sendPushNotification,
  updateLocation,
} from "../../api";

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

  useLayoutEffect(() => {
    if (user) {
      onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        if (
          !snapshot.exists() ||
          (snapshot.exists() && !snapshot.data().active)
        ) {
          navigation.navigate("Profile", { newUser: true });
        }
      });
    }
  }, [user, navigation]);

  useEffect(() => {
    if (notifications.length > 0) {
      const currentNotification = notifications[0];
      if (isFocused && currentNotification.type === "match") {
        const loggedInProfile = currentNotification.data.match.loggedInProfile;
        const userSwiped = currentNotification.data.match.userSwiped;
        navigation.navigate("Match", {
          loggedInProfile,
          userSwiped,
          matchDetails: currentNotification.data.matchDetails,
        });
      } else if (!isFocused && currentNotification.type === "match") {
        Toast.show({
          type: "success",
          text1: `You got a new match! (${currentNotification.data.match.userSwiped.itemName})`,
          text2: `${currentNotification.data.match.userSwiped.displayName} wants to swap with you.`,
          onHide: () => {
            removeNotification(currentNotification);
          },
          onPress: () => {
            Toast.hide();
            navigation.navigate("Message", {
              matchDetails: currentNotification.data.matchDetails,
            });
          },
        });
      } else if (currentNotification.type === "message") {
        Toast.show({
          type: "success",
          text1: `${currentNotification.data.message.sender.displayName} (${currentNotification.data.message.sender.itemName})`,
          text2: currentNotification.data.message.message,
          onHide: () => {
            removeNotification(currentNotification);
          },
          onPress: () => {
            Toast.hide();
            navigation.navigate("Message", {
              matchDetails: currentNotification.data.matchDetails,
            });
          },
        });
      } else {
        Toast.show({
          type: "success",
          text1: currentNotification.data.title,
          text2: currentNotification.data.text,
          onHide: () => {
            removeNotification(currentNotification);
          },
        });
      }
    }
  }, [notifications]);

  useEffect(() => {
    if (user) {
      const accessToken = user.stsTokenManager.accessToken;
      const getPermissions = async () => {
        if (await !checkUserExists(accessToken)) return;
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert("Please grant location permissions");
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
        const reverseGeocode = await Location.reverseGeocodeAsync(coords);
        const city = reverseGeocode[0].city;
        if (city) {
          updateLocation(accessToken, city, coords);
        }
      };
      getPermissions();
    }
  }, []);

  useEffect(() => {
    let unsub;
    if (user) {
      const accessToken = user.stsTokenManager.accessToken;
      const fetchCards = async () => {
        let userCoords: Coords;
        let radius: number;
        let passes;
        let swipes;
        const searchPreferences = await getSearchPreferences(accessToken);
        if (searchPreferences) {
          userCoords = searchPreferences.userCoords;
          radius = searchPreferences.radius;
          passes = searchPreferences.passes;
          swipes = searchPreferences.swipes;
        }
        const passedUserIds = passes.length > 0 ? passes : ["none"];
        const swipedUserIds = swipes.length > 0 ? swipes : ["none"];

        unsub = onSnapshot(
          query(
            collection(db, "users"),
            where("id", "not-in", [
              ...passedUserIds,
              ...swipedUserIds,
              user.uid,
            ])
          ),
          (snapshot) => {
            setProfiles(
              snapshot.docs
                .filter(
                  (doc) =>
                    getDistance(doc.data().coords, userCoords) / 1609.34 <
                      radius && doc.data().active
                )
                .map((doc) => ({
                  id: doc.id,
                  displayName: doc.data().displayName,
                  itemName: doc.data().itemName,
                  ...doc.data(),
                }))
            );
          }
        );
      };

      fetchCards();
    }
    return unsub;
  }, [db, params]);

  const swipeLeft = async (cardIndex: number) => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    if (user) {
      const accessToken = user.stsTokenManager.accessToken;
      pass(accessToken, userSwiped);
    }
  };

  const swipeRight = async (cardIndex: number) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    if (user) {
      const accessToken = user.stsTokenManager.accessToken;
      const response = await like(accessToken, userSwiped);
      if (response && response.status == 201) {
        const loggedInProfile = response.data;
        const matchDetails = {
          id: generateId(loggedInProfile.id, userSwiped.id),
          users: {
            [loggedInProfile.id]: {
              ...loggedInProfile,
            },
            [userSwiped.id]: {
              ...userSwiped,
            },
          },
          usersMatched: [loggedInProfile.id, userSwiped.id],
        };
        sendPushNotification(accessToken, "match", matchDetails, "");
        navigation.navigate("Match", {
          loggedInProfile,
          userSwiped,
          matchDetails,
        });
      }
    }
  };

  return (
    <SafeArea>
      {/* Start of Header */}
      <HeaderContainer>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          {user && user.photoURL ? (
            <AccountImage
              source={{
                uri: `${CLOUD_FRONT_API_ENDPOINT}/fit-in/400x400/public/profiles/${user.photoURL}`,
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
            swipeLeft(cardIndex);
          }}
          onSwipedRight={(cardIndex) => {
            swipeRight(cardIndex);
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
