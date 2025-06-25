class PetCareGiverHistoryModel {
  String? careGiver;
  String? startDate;
  String? endDate;
  String? price;

  PetCareGiverHistoryModel({this.careGiver, this.startDate, this.endDate, this.price});

  PetCareGiverHistoryModel.fromJson(Map<String, dynamic> json) {
    careGiver = json['careGiver'];
    startDate = json['startDate'];
    endDate = json['endDate'];
    price = json['price'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['careGiver'] = careGiver;
    data['startDate'] = startDate;
    data['endDate'] = endDate;
    data['price'] = price;
    return data;
  }
}