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
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { CLOUD_FRONT_API_ENDPOINT } from "@env";
import generateId from "../../lib/generateId";

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

  useLayoutEffect(() => {
    if (user) {
      onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        if (!snapshot.exists()) {
          const newUser = true;
          navigation.navigate("Profile", { newUser });
        }
      });
    }
  }, [user, navigation]);

  useEffect(() => {
    let unsub;

    const fetchCards = async () => {
      if (user) {
        const passes = await getDocs(
          collection(db, "users", user.uid, "passes")
        ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

        const swipes = await getDocs(
          collection(db, "users", user.uid, "swipes")
        ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

        const passedUserIds = passes.length > 0 ? passes : ["none"];
        const swipedUserIds = swipes.length > 0 ? swipes : ["none"];

        unsub = onSnapshot(
          query(
            collection(db, "users"),
            where("id", "not-in", [...passedUserIds, ...swipedUserIds])
          ),
          (snapshot) => {
            setProfiles(
              snapshot.docs
                .filter((doc) => doc.id !== user.uid)
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
  }, [db]);

  const swipeLeft = async (cardIndex: number) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    console.log(`You swiped NOPE on ${userSwiped.displayName}`);
    if (user) {
      setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
    }
  };

  const swipeRight = async (cardIndex: number) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    if (user) {
      const loggedInProfile = await await (
        await getDoc(doc(db, "users", user.uid))
      ).data();

      // Check if user swiped on 'you' (TODO: Migrate to cloud function)
      getDoc(doc(db, "users", userSwiped.id, "swipes", user.uid)).then(
        (documentSnapshot) => {
          if (documentSnapshot.exists()) {
            console.log(`HOORAY! You MATCHED with ${userSwiped.displayName}`);

            setDoc(
              doc(db, "users", user.uid, "swipes", userSwiped.id),
              userSwiped
            );

            // Create MATCH
            setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
              users: {
                [user.uid]: loggedInProfile,
                [userSwiped.id]: userSwiped,
              },
              usersMatched: [user.uid, userSwiped.id],
              timestamp: serverTimestamp(),
            });

            navigation.navigate("Match", {
              loggedInProfile,
              userSwiped,
            });
          } else {
            // User has swiped as first interaction with another user or no match :(
            console.log(
              `You swiped on ${userSwiped.displayName} (${userSwiped.itemName})`
            );
            setDoc(
              doc(db, "users", user.uid, "swipes", userSwiped.id),
              userSwiped
            );
          }
        }
      );
    }

    if (user) {
      setDoc(doc(db, "users", user.uid, "swipes", userSwiped.id), userSwiped);
    }
  };

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
