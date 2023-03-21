import { Storage } from "aws-amplify";

const deleteS3Folder = async (folderPath: string) => {
  try {
    const contents = await Storage.list(folderPath, { pageSize: 1 });
    if (contents.results) {
      const keys = contents.results.map((result) => result.key);
      await Promise.all(
        keys.map(async (key) => {
          if (key) await Storage.remove(key);
        })
      );
    }
  } catch (error) {
    console.error(`Error deleting contents of ${folderPath}: `, error);
  }
};

export default deleteS3Folder;
