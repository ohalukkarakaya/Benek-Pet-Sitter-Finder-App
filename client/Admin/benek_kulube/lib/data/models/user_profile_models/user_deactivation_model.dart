class UserDeactivation {
  bool? isDeactive;
  String? deactivationDate;
  bool? isAboutToDelete;

  UserDeactivation(
    {
      this.isDeactive, 
      this.deactivationDate, 
      this.isAboutToDelete
    }
  );

  UserDeactivation.fromJson( Map<String, dynamic> json ){
    isDeactive = json['isDeactive'];
    deactivationDate = json['deactivationDate'];
    isAboutToDelete = json['isAboutToDelete'];
  }

  Map<String, dynamic> toJson(){
    final Map<String, dynamic> data = <String, dynamic>{};
    data['isDeactive'] = isDeactive;
    data['deactivationDate'] = deactivationDate;
    data['isAboutToDelete'] = isAboutToDelete;
    return data;
  }
}