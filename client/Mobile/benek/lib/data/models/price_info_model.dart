import 'package:benek/data/models/order_info_model.dart';

class PriceInfo {
  String? priceType;
  int? servicePrice;
  int? extraMissionPrice;
  int? maxMissionCount;
  int? boughtExtra;
  String? orderId;
  OrderInfo? orderInfo;

  PriceInfo(
    {
      this.priceType,
      this.servicePrice,
      this.extraMissionPrice,
      this.maxMissionCount,
      this.boughtExtra,
      this.orderId,
      this.orderInfo
    }
  );

  PriceInfo.fromJson( Map<String, dynamic> json ){
    priceType = json['priceType'];
    servicePrice = json['servicePrice'];
    extraMissionPrice = json['extraMissionPrice'];
    maxMissionCount = json['maxMissionCount'];
    boughtExtra = json['boughtExtra'];
    orderId = json['orderId'];
    orderInfo = json['orderInfo'] != null
        ? OrderInfo.fromJson( json['orderInfo'] )
        : null;
  }

  Map<String, dynamic> toJson(){
    final Map<String, dynamic> data = <String, dynamic>{};
    data['priceType'] = priceType;
    data['servicePrice'] = servicePrice;
    data['extraMissionPrice'] = extraMissionPrice;
    data['maxMissionCount'] = maxMissionCount;
    data['boughtExtra'] = boughtExtra;
    data['orderId'] = orderId;
    if( orderInfo != null ){
      data['orderInfo'] = orderInfo!.toJson();
    }
    return data;
  }
}