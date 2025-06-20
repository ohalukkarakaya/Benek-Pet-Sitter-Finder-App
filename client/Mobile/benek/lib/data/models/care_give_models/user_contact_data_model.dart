class UserContactDataModel {
  String? email;
  String? phone;

  UserContactDataModel({
    this.email,
    this.phone,
  });

  UserContactDataModel.fromJson(Map<String, dynamic> json) {
    email = json['email'] ?? json['petOwnerEmail'] ?? json['careGiverEmail'];
    phone = json['phone'] ?? json['petOwnerPhone'] ?? json['careGiverPhone'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['email'] = email;
    data['phone'] = phone;
    return data;
  }
}