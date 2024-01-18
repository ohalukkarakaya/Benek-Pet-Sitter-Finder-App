class UserFollowingUsersOrPets {
  String? type;
  String? followingId;

  UserFollowingUsersOrPets(
    {
      this.type, 
      this.followingId
    }
  );

  UserFollowingUsersOrPets.fromJson( Map<String, dynamic> json ){
    type = json['type'];
    followingId = json['followingId'];
  }

  Map<String, dynamic> toJson(){
    final Map<String, dynamic> data = <String, dynamic>{};
    data['type'] = type;
    data['followingId'] = followingId;
    return data;
  }
}