import { v4 as uuidv4 } from "uuid";

const extractPhoto = async (imageUrl: string) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const urlParts = imageUrl.split(".");
  const extension = urlParts[urlParts.length - 1];
  const key = `${uuidv4()}.${extension}`;

  return { key, blob };
};

export default extractPhoto;
