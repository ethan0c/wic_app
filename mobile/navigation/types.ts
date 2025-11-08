import { NavigationProp } from '@react-navigation/native';
import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Intro: undefined;
  AuthIndex: undefined;
  SignIn: undefined;
  SignUpName: undefined;
  SignUpEmail: { firstName: string; lastName?: string };
  SignUpPassword: { email: string; firstName?: string; lastName?: string };
  ForgotPassword: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Scanner: undefined;
  Benefits: undefined;
  Resources: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList> | undefined;
} & AuthStackParamList;
