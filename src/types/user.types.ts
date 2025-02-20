export type UserProfile = {
  username: string;
  name: string;
  expired: boolean;
  isPremium: boolean;
  teams: number[];
  votes: number;
  token?: string;
  logged?: boolean;
};
export type UserProfileResponse = {
  token?: string;
  logged?: boolean;
  user: {
    username: string;
    password: string;
    name: string;
    isPremium: boolean;
    teams: number[];
    votes: number;
  };
};

export type GenericUser = Pick<UserProfile, 'name' | 'username' | 'isPremium'> & {
  _id: string;
  votes: number[];
  teams: number;
};
