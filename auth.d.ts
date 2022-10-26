interface UserObj {
  user: {
    displayName: string;
    email: string;
    uid: string;
  };
}

interface Logout {
  (): void;
}
