import type { DrawerScreenProps } from '@react-navigation/drawer';


export type RootDrawerParamList = {
  Emailer: undefined
  Settings: undefined;
};

export type RootDrawerScreenProps<T extends keyof RootDrawerParamList> =
  DrawerScreenProps<RootDrawerParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootDrawerParamList {}
  }
}