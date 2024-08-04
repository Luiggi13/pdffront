export type Restaurants = {
  _id: string;
  name: string;
  description: string;
  street: string;
  gmaps: string;
  image: string;
  web: string;
  voteUp: number;
  voteDown: number;
  voteOk: string[];
  voteKo: string[];
  users: string[];
  error?: string;
  username?: string;
  enabled: boolean;
  discarded: boolean;
};

export type UpdateVote = Pick<Restaurants, 'voteUp' | 'voteDown' | 'username'>;
export type PostRestaurant = Omit<Restaurants, '_id'>;
