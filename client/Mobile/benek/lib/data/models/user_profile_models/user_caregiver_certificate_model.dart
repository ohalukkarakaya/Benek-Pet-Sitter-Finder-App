class UserCareGiverCertificates {
  String? desc;
  String? fileUrl;

  UserCareGiverCertificates(
    {
      this.desc, 
      this.fileUrl
    }
  );

  UserCareGiverCertificates.fromJson( Map<String, dynamic> json ){
    desc = json['desc'];
    fileUrl = json['fileUrl'];
  }

  Map<String, dynamic> toJson(){
    final Map<String, dynamic> data = <String, dynamic>{};
    data['desc'] = desc;
    data['fileUrl'] = fileUrl;
    return data;
  }
}