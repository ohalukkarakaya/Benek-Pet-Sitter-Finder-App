class UserProfileImg {
  String? imgUrl;
  bool? isDefaultImg;
  String? recordedImgName;

  UserProfileImg(
    {
      this.imgUrl, 
      this.isDefaultImg, 
      this.recordedImgName
    }
  );

  UserProfileImg.fromJson( Map<String, dynamic> json ){
    imgUrl = json['imgUrl'];
    isDefaultImg = json['isDefaultImg'] ?? json['isDefault'];
    recordedImgName = json['recordedImgName'];
  }

  Map<String, dynamic> toJson(){
    final Map<String, dynamic> data = <String, dynamic>{};
    data['imgUrl'] = imgUrl;
    data['isDefaultImg'] = isDefaultImg;
    data['recordedImgName'] = recordedImgName;
    return data;
  }
}