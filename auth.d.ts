interface UserObj {
  user: {
    displayName: string;
    email: string;
    uid: string;
  };
}

interface LoginWithEmailAndPassword {
  (arg1: string, arg2: string): void;
}

interface Logout {
  (): void;
}

interface AuthContextInterface {
  user: UserObj | null;
  loginWithEmailAndPassword: LoginWithEmailAndPassword;
  logout: Logout;
  isLoading: boolean;
  error: string | null;
}
