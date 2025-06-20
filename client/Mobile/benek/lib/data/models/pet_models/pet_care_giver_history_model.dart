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
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['careGiver'] = this.careGiver;
    data['startDate'] = this.startDate;
    data['endDate'] = this.endDate;
    data['price'] = this.price;
    return data;
  }
}