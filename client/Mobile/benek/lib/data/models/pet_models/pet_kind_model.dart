class PetKindModel {
  String? tr;
  String? en;

  PetKindModel({
    required this.tr,
    required this.en,
  });

  PetKindModel.fromJson(Map<String, dynamic> json) {
    tr = json['tr'];
    en = json['en'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['tr'] = tr;
    data['en'] = en;
    return data;
  }
}