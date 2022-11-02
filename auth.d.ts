interface LoginWithEmailAndPassword {
  (arg1: string, arg2: string): void;
}

interface RegisterWithEmailAndPassword {
  (arg1: string, arg2: string, arg3: string): void;
}

interface UserObj {
  displayName: string;
  email: string;
  uid: string;
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
