export type PublicStackParamList = {
  Login: undefined;
  Welcome: undefined;
  Help: undefined;
  Waiting: undefined;
  CreateAccount: undefined;
};

export type OnboardingStackParamList = {
  ProfileType: undefined;
  RegisterProfile: { profileType: "member" | "leader" };
  RegisterChurch: undefined;
};
