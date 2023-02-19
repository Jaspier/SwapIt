import { MatchedUser } from "./../types";
const getMatchedUserInfo = (users: MatchedUser[], userLoggedIn: any) => {
  const newUsers = { ...users };
  delete newUsers[userLoggedIn];

  const [id, user]: any = Object.entries(newUsers).flat();

  return { id, ...user };
};

export default getMatchedUserInfo;
