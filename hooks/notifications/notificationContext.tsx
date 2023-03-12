import React, { createContext, useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { Notification } from "../../types";
import AuthenticationContext from "../authentication/authenticationContext";

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (notification: Notification) => void;
};

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
});

export const NotificationListener = ({ children }: any) => {
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { user }: AuthContextInterface = authContext;
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      const handleNotification = (notification: any) => {
        const data = notification.request.content.data;
        const newNotification = { type: data.type, data };
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          newNotification,
        ]);
      };
      Notifications.addNotificationReceivedListener(handleNotification);
      return () => {
        //@ts-ignore
        Notifications.removeNotificationSubscription(handleNotification);
      };
    }
  }, [user]);

  useEffect(() => {
    if (notifications.length > 0) {
      // Display the current notification for 4 seconds
      setTimeout(() => {
        // Remove the current notification from the queue
        setNotifications((prevNotifications) => prevNotifications.slice(1));
      }, 4000);
    }
  }, [notifications]);

  const addNotification = (notification: Notification) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      notification,
    ]);
  };

  const removeNotification = (notification: Notification) => {
    setNotifications(notifications.filter((n) => n !== notification));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
