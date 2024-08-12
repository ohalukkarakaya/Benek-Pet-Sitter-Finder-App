class PrivateInfoModel {
  String? email;
  String? phone;
  String? iban;
  String? identityNumber;

  PrivateInfoModel({
    this.email,
    this.phone,
    this.iban,
    this.identityNumber,
  });

  factory PrivateInfoModel.fromJson(Map<String, dynamic> json) {
    return PrivateInfoModel(
      email: json['email'],
      phone: json['phone'],
      iban: json['iban'],
      identityNumber: json['nationalIdNo'],
    );
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['email'] = email;
    data['phone'] = phone;
    data['iban'] = iban;
    data['nationalIdNo'] = identityNumber;
    return data;
  }
}