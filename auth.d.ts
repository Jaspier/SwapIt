interface LoginWithEmailAndPassword {
  (arg1: string, arg2: string): void;
}

interface RegisterWithEmailAndPassword {
  (arg1: string, arg2: string, arg3: string): void;
}

type TokenManager = {
  accessToken: string;
};

interface UserObj {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
  stsTokenManager: TokenManager;
}

interface Logout {
  (): void;
}

interface AuthContextInterface {
  user: UserObj | null;
  loginWithEmailAndPassword: LoginWithEmailAndPassword;
  registerWithEmailAndPassword: RegisterWithEmailAndPassword;
  logout: Logout;
  isLoading: boolean;
  error: string | null;
}
