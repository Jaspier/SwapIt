import React, { createContext, useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import AuthenticationContext from "../authentication/authenticationContext";

type Notification = {
  type: "match" | "message";
  data: any;
};

type NotificationContextType = {
  notification: Notification | null;
  setNotification: (notification: Notification | null) => void;
};

export const NotificationContext = createContext<NotificationContextType>({
  notification: null,
  setNotification: () => {},
});

export const NotificationListener = ({ children }: any) => {
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { user }: AuthContextInterface = authContext;
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (user) {
      const handleNotification = (notification: any) => {
        const data = notification.request.content.data;
        if (data.type === "match" || data.type === "message") {
          setNotification({ type: data.type, data });
        }
      };
      Notifications.addNotificationReceivedListener(handleNotification);
      return () => {
        //@ts-ignore
        Notifications.removeNotificationSubscription(handleNotification);
      };
    }
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{ notification, setNotification: setNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
