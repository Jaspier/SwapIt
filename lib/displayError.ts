import Toast from "react-native-toast-message";

const displayError = (message: string | undefined) => {
  Toast.show({
    type: "error",
    text1: "System Log",
    text2: message ? message : "An error has occurred. Please try again later.",
    onPress: () => {
      Toast.hide();
    },
  });
};

export default displayError;
