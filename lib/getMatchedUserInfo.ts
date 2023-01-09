const getMatchedUserInfo = (users: any, userLoggedIn: any) => {
  const newUsers = { ...users };
  delete newUsers[userLoggedIn];

  const [id, user]: any = Object.entries(newUsers).flat();

  return { id, ...user };
};

export default getMatchedUserInfo;
