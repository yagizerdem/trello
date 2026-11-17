class Profile {
  id: string;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
  first_name: string;
  last_name: string;
  avatar_url: string;

  constructor(
    id: string,
    user_id: string,
    created_at: Date,
    updated_at: Date,
    first_name: string,
    last_name: string,
    avatar_url: string,
  ) {
    this.id = id;
    this.user_id = user_id;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
    this.first_name = first_name;
    this.last_name = last_name;
    this.avatar_url = avatar_url;
  }
}

export default Profile;
