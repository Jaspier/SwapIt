import * as ImagePicker from "expo-image-picker";

export const takePhoto = async () => {
  const { granted } = await ImagePicker.requestCameraPermissionsAsync();
  if (granted) {
    let data = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!data.cancelled) {
      return data.uri;
    }
  } else {
    alert("No permission granted.");
  }
};
