export interface Coords {
  longitude: number;
  latitude: number;
}

export interface User {
  id: number;
  displayName: string;
  itemName: string;
  location: string;
}

export interface Profile {
  id: string;
  displayName: string;
  itemName: string;
}

export interface MatchedUser {
  active: boolean;
  coords: Coords;
  displayName: string;
  id: string;
  itemName: string;
  location: string;
  photoUrls: string;
  radius: number;
  timestamp: any;
  isNewUser: boolean;
  profilePic: string;
}

export interface Match {
  id: string;
  timestamp: any;
  users: MatchedUser[];
  usersMatched: string[];
  deactivated: boolean;
}

export interface Message {
  displayName: string;
  message: string;
  photoUrl: string;
  timestamp: any;
  userId: string;
}

export interface Notification {
  type: string;
  data: {
    match: {
      loggedInProfile: MatchedUser;
      userSwiped: MatchedUser;
    };
    message: {
      message: string;
      sender: MatchedUser;
    };
    matchDetails: Match;
    title: string;
    text: string;
  };
}
