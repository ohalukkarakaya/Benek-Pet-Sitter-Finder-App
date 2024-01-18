class OrderInfo {
  String? paymentId;
  String? orderId;
  String? orderUniqueCode;

  OrderInfo(
    {
      this.paymentId, 
      this.orderId, 
      this.orderUniqueCode
    }
  );

  OrderInfo.fromJson( Map<String, dynamic> json ){
    paymentId = json['paymentId'];
    orderId = json['orderId'];
    orderUniqueCode = json['orderUniqueCode'];
  }

  Map<String, dynamic> toJson(){
    final Map<String, dynamic> data = <String, dynamic>{};
    data['paymentId'] = paymentId;
    data['orderId'] = orderId;
    data['orderUniqueCode'] = orderUniqueCode;
    return data;
  }
}