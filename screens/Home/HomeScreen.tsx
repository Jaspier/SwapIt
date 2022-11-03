import { TouchableOpacity } from "react-native";
import React from "react";
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
} from "./homeStyles";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

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
  if (!authContext) {
    return null;
  }
  const { user }: AuthContextInterface = authContext;
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
          cards={DUMMY_DATA}
          renderCard={(card: any) => (
            <Card key={card.id}>
              <CardImage source={{ uri: card.photoURLs[0] }} />
            </Card>
          )}
        />
      </SwiperContainer>
      {/* End of Cards Section */}
    </SafeArea>
  );
};

export default HomeScreen;
