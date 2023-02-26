import { TouchableOpacity } from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import { Coords } from "../../types";
import * as Notifications from "expo-notifications";
import Toast from "react-native-toast-message";

interface Profile {
  id: string;
  displayName: string;
  itemName: string;
}

const HomeScreen = ({ navigation }: any) => {
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

  const handleNotification = (notification: any) => {
    const data = notification.request.content.data;
    if (data.type === "match") {
      const loggedInProfile = data.loggedInProfile;
      const userSwiped = data.userSwiped;
      navigation.navigate("Match", {
        loggedInProfile,
        userSwiped,
      });
    } else if (data.type === "message") {
      Toast.show({
        type: "success",
        text1: `${data.message.sender.displayName} (${data.message.sender.itemName})`,
        text2: data.message.message,
      });
    }
  };

  useEffect(() => {
    Notifications.addNotificationReceivedListener(handleNotification);
  }, []);

  useEffect(() => {
    const getPermissions = async () => {
      if (user) {
        axios
          .get("/checkUserExists", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.stsTokenManager.accessToken}`,
            },
          })
          .then((e) => {
            if (e.status !== 200) {
              return;
            }
          })
          .catch((error) => {
            alert(error.message);
          });
      }
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
      if (user) {
        axios
          .post(
            "/updateLocation",
            {
              location: city,
              coords: coords,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.stsTokenManager.accessToken}`,
              },
            }
          )
          .catch((e) => {
            console.error(e.response.data.detail);
          });
      }
    };
    getPermissions();
  }, []);

  useEffect(() => {
    let unsub;

    const fetchCards = async () => {
      let userCoords: Coords;
      let radius: number;
      let passes;
      let swipes;
      if (user) {
        try {
          const res = await axios.get("/getSearchPreferences", {
            headers: {
              Authorization: `Bearer ${user.stsTokenManager.accessToken}`,
            },
          });
          userCoords = res.data.coords;
          radius = res.data.radius;
          passes = res.data.passes;
          swipes = res.data.swipes;
        } catch (e: any) {
          console.error(e.response.data.detail);
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
      }
    };

    fetchCards();
    return unsub;
  }, [db, params]);

  const swipeLeft = async (cardIndex: number) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    console.log(`You swiped NOPE on ${userSwiped.displayName}`);
    if (user) {
      axios
        .post("/swipeLeft", userSwiped, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.stsTokenManager.accessToken}`,
          },
        })
        .catch((e) => {
          console.error(e.response.data.detail);
        });
    }
  };

  const swipeRight = async (cardIndex: number) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    console.log(`You swiped SWAPIT on ${userSwiped.displayName}`);
    if (user) {
      axios
        .post("/swipeRight", userSwiped, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.stsTokenManager.accessToken}`,
          },
        })
        .then((e) => {
          if (e.status === 201) {
            const loggedInProfile = e.data;
            axios
              .post(
                "/sendPushNotification",
                {
                  type: "match",
                  matchedUsers: {
                    loggedInProfile,
                    userSwiped,
                  },
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.stsTokenManager.accessToken}`,
                  },
                }
              )
              .catch((e) => {
                console.error(e.response.data.detail);
              });
            navigation.navigate("Match", {
              loggedInProfile,
              userSwiped,
            });
          }
        })
        .catch((e) => {
          console.error(e.response.data.detail);
        });
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
