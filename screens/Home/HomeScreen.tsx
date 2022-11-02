import { TouchableOpacity } from "react-native";
import React from "react";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import { SafeArea } from "../../components/utilities";
import { HeaderContainer, AvatarIcon, Logo } from "./homeStyles";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

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
    </SafeArea>
  );
};

export default HomeScreen;
