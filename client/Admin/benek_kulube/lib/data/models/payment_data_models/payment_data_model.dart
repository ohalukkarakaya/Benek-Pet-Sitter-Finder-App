import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:intl/intl.dart';

class PaymentDataModel {
  DateFormat format = DateFormat('yyyy-MM-ddTHH:mm:ss.SSSZ');

  String? id;
  UserInfo? careGiver;
  UserInfo? petOwner;
  String? amount;
  DateTime? date;

  PaymentDataModel({
    this.id,
    this.careGiver,
    this.petOwner,
    this.amount,
    this.date,
  });

  PaymentDataModel.fromJson(Map<String, dynamic> json) {
    id = json['paymentId'] ?? json['_id'];
    careGiver = UserInfo.fromJson(json['careGiver']);
    petOwner = UserInfo.fromJson(json['petOwner']);
    amount = json['amount'];
    date = format.parse(json['createdAt']);
  }
}