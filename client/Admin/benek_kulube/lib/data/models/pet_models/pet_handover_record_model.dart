class PetHandoverRecordModel {
  String? from;
  String? to;

  PetHandoverRecordModel({this.from, this.to});

  PetHandoverRecordModel.fromJson(Map<String, dynamic> json) {
    from = json['from'];
    to = json['to'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['from'] = from;
    data['to'] = to;
    return data;
  }
}