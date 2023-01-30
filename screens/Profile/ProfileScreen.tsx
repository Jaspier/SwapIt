import {
  FlatList,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import { SafeArea } from "../../components/utilities";
import * as ImagePicker from "expo-image-picker";
import Header from "../../components/Header/Header";
import { AntDesign } from "@expo/vector-icons";
import {
  DisplayName,
  ImagePickerPressable,
  MaxImagesText,
  SelectedImages,
  DetailsContainer,
} from "./profileStyles";
import {
  Label,
  Input,
  ButtonContainer,
  ButtonText,
  UpdateProfileButton,
} from "../../components/form";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Storage } from "aws-amplify";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { CLOUD_FRONT_API_ENDPOINT } from "@env";
import axios from "axios";
import { useRoute } from "@react-navigation/core";

const ProfileScreen = ({ navigation }: any) => {
  const { params } = useRoute();
  let isNewUser: boolean | null | undefined;
  if (params) {
    // @ts-ignore
    const { newUser } = params;
    isNewUser = newUser;
  }
  const [images, setImages] = useState<ImagePicker.ImageInfo[] | null>(null);
  const [imagesSelected, setImagesSelected] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState<ImagePicker.ImageInfo[]>(
    []
  );
  const [incompleteForm, setIncompleteForm] = useState(true);
  const [initialPhotoUrls, setInitialPhotoUrls] = useState("");
  const [itemName, setItemName] = useState("");
  const [initialItemName, setInitialItemName] = useState("");
  const [location, setLocation] = useState("");
  const [initialLocation, setInitialLocation] = useState("");
  const [processing, setProcessing] = useState(false);
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { user }: AuthContextInterface = authContext;

  useEffect(() => {
    if (user && !isNewUser) {
      axios
        .get(`/myprofile?user=${user.uid}`)
        .then((res) => {
          const documentSnapshot = res.data;
          setImages(JSON.parse(documentSnapshot.photoUrls));
          setImagesToDelete(JSON.parse(documentSnapshot.photoUrls));
          setInitialPhotoUrls(documentSnapshot.photoUrls);
          setItemName(documentSnapshot.itemName);
          setInitialItemName(documentSnapshot.itemName);
          setLocation(documentSnapshot.location);
          setInitialLocation(documentSnapshot.location);
        })
        .catch((e) => console.log("error fetching profile data", e));
    }
  }, [user]);

  useEffect(() => {
    if (
      itemName !== initialItemName ||
      location !== initialLocation ||
      (itemName !== "" && location !== "" && imagesSelected)
    ) {
      setIncompleteForm(false);
    } else {
      setIncompleteForm(true);
    }
  }, [itemName, initialItemName, location, initialLocation, imagesSelected]);

  const pickImages = async () => {
    (async () => {
      if (Platform.OS === "ios") {
        const { accessPrivileges } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (accessPrivileges === "none") {
          alert("No permission granted.");
        } else {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 3,
            aspect: [4, 3],
            quality: 1,
          });

          if (!result.cancelled) {
            setImages(result.selected);
            setImagesSelected(true);
          }
        }
      }
    })();
  };

  const imageAllUrls: { uri: string }[] = [];
  const storeToDB = async () => {
    setProcessing(true);
    images &&
      images.map(async (component, index) => {
        if (imagesSelected) {
          const imageUrl = component.uri;
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const urlParts = imageUrl.split(".");
          const extension = urlParts[urlParts.length - 1];
          const key = `${uuidv4()}.${extension}`;
          imageAllUrls.push({ uri: key });
          for (let i in imagesToDelete) {
            await Storage.remove(imagesToDelete[i].uri);
          }
          await Storage.put(key, blob);
        }
        if (index + 1 === images.length && user) {
          setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            displayName: user.displayName ? user.displayName : user.email,
            photoUrls: imagesSelected
              ? JSON.stringify(imageAllUrls)
              : initialPhotoUrls,
            itemName: itemName,
            location: location,
            active: true,
            timestamp: serverTimestamp(),
          })
            .then(() => {
              setProcessing(false);
              navigation.navigate("Home");
            })
            .catch((error) => {
              alert(error.message);
            });
        }
      });
  };

  return (
    <SafeArea>
      <Header title="Profile" isNewUser={isNewUser} settings />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <DisplayName>
            Hello,{" "}
            {user && !user.displayName ? user.email : user && user.displayName}
          </DisplayName>
          <DetailsContainer>
            <Label>Your item for swap</Label>
            <Input
              value={itemName ? itemName : ""}
              onChangeText={setItemName}
              placeholder="Enter the name of your item"
            />
            <Label>Your location</Label>
            <Input
              value={location ? location : ""}
              onChangeText={setLocation}
              placeholder="Enter your location"
            />
          </DetailsContainer>
          <ImagePickerPressable onPress={pickImages}>
            <AntDesign name="pluscircle" size={24} color="grey" />
          </ImagePickerPressable>
        </View>
      </TouchableWithoutFeedback>
      <MaxImagesText>Upload images [Max 3 photos]</MaxImagesText>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={images}
        renderItem={({ item }) => (
          <SelectedImages
            source={{
              uri: imagesSelected
                ? item.uri
                : `${CLOUD_FRONT_API_ENDPOINT}/fit-in/400x400/public/${item.uri}`,
            }}
          />
        )}
      />
      <ButtonContainer>
        <UpdateProfileButton
          disabled={incompleteForm || processing}
          onPress={() => storeToDB()}
        >
          <ButtonText>Update Profile</ButtonText>
        </UpdateProfileButton>
      </ButtonContainer>
    </SafeArea>
  );
};

export default ProfileScreen;
