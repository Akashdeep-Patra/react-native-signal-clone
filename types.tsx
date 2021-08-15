/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
  HomeScreen: undefined;
  LoginScreen: undefined;
  SignupScreen: undefined;
  AddChatScreen: undefined;
  ChatScreen: { id: string; chatText: string };
};
// import MainNavigatorParamsList and AuthNavigatorParamsList

export type MainRouteProp<RouteName extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, RouteName>;

export type BottomTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};
