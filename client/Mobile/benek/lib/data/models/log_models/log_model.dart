import 'package:intl/intl.dart';

class LogModel {
  DateFormat format = DateFormat('yyyy-MM-ddTHH:mm:ss.SSSZ');

  String? id;
  String? userId;
  String? method;
  String? url;
  dynamic status;
  dynamic contentLength;
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
    status = parseIntIfItIsInt(json['status']);
    contentLength = parseIntIfItIsInt(json['contentLength']);
    responseTime = json['responseTime'];
    date = format.parse(json['date']);
  }

  Map<String, dynamic> toJson(){
    final Map<String, dynamic> data = <String, dynamic>{};

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

  dynamic parseIntIfItIsInt(dynamic value) {
    if (value is String) {
      try {
        return int.parse(value);
      } catch (e) {
        return value;
      }
    } else if (value is int) {
      return value;
    }
    return null;
  }
}