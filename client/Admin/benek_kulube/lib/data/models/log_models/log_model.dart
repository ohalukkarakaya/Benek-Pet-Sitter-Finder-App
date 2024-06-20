import 'package:intl/intl.dart';

class LogModel {
  DateFormat format = DateFormat('yyyy-MM-ddTHH:mm:ss.SSSZ');

  String? id;
  String? userId;
  String? method;
  String? url;
  int? status;
  int? contentLength;
  String? responseTime;
  DateTime? date;

  LogModel({
      this.id,
      this.userId = "User Id Not Found",
      this.method,
      this.url,
      this.status,
      this.contentLength,
      this.responseTime,
      this.date
  });

  LogModel.fromJson( Map<String, dynamic> json ){
    id = json['_id'];
    userId = json['userId'];
    method = json['method'];
    status = json['status'];
    contentLength = json['contentLength'];
    responseTime = json['responseTime'];
    date = format.parse(json['date']);
  }

  Map<String, dynamic> toJson(){
    final Map<String, dynamic> data = new Map<String, dynamic>();

    data['_id'] = id;
    data['userId'] = userId;
    data['method'] = method;
    data['url'] = url;
    data['status'] = status;
    data['contentLength'] = contentLength;
    data['responseTime'] = responseTime;
    data['date'] = date;

    return data;
  }
}