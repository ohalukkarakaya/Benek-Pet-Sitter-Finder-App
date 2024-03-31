class PetVaccinationCertificateModel {
  String? desc;
  String? fileUrl;

  PetVaccinationCertificateModel({this.desc, this.fileUrl});

  PetVaccinationCertificateModel.fromJson(Map<String, dynamic> json) {
    desc = json['desc'];
    fileUrl = json['fileUrl'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = Map<String, dynamic>();
    data['desc'] = desc;
    data['fileUrl'] = fileUrl;
    return data;
  }
}