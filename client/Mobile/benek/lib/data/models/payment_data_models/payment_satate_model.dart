import 'package:benek/data/models/payment_data_models/payment_data_model.dart';

class PaymentStateModel {
  double? profit;
  double? customersShare;
  double? customersTax;
  double? totalMoneyOnPool;
  List<PaymentDataModel>? payments;

  PaymentStateModel({
    this.profit,
    this.customersShare,
    this.customersTax,
    this.totalMoneyOnPool,
    this.payments,
  });

  PaymentStateModel.fromJson(Map<String, dynamic> json) {
    profit = json['profit']?.toDouble();
    customersShare = json['customersShare']?.toDouble();
    customersTax = json['customersTax']?.toDouble();
    totalMoneyOnPool = json['totalMoneyOnPool']?.toDouble();
    if (json['payments'] != null) {
      payments = <PaymentDataModel>[];
      json['payments'].forEach((v) {
        payments!.add(PaymentDataModel.fromJson(v));
      });
    }
  }

  void setMoneyInfo( double profit, double customersShare, double customersTax, double totalMoneyOnPool ){
    this.profit = profit;
    this.customersShare = customersShare;
    this.customersTax = customersTax;
    this.totalMoneyOnPool = totalMoneyOnPool;
  }

  void setPayments(List<PaymentDataModel> payments) {
    this.payments = payments;
  }
}