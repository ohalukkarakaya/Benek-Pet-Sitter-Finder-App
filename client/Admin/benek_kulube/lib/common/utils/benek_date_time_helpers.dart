import 'package:benek_kulube/common/utils/benek_string_helpers.dart';

class BenekDateTimeHelpers {
  static Map<String, dynamic> getCurrentDateTime() {
    // Şu anki tarih ve saat bilgisini al
    DateTime now = DateTime.now();

    // Saat dakika ve tarih değerlerini al
    int hour = now.hour;
    int minute = now.minute;
    int year = now.year;
    int month = now.month;
    int day = now.day;
    int dayOfWeek = now.weekday;

    String hourString = hour < 10 ? '0$hour' : '$hour';
    String minuteString = minute < 10 ? '0$minute' : '$minute';
    String dayString = day < 10 ? '0$day' : '$day';

    // Saat ve dakikayı birleştirip döndür
    return {
      'hour': hourString, 
      'minute': minuteString,
      'year': year,
      'month': BenekStringHelpers.getMonthAsString(month),
      'day': dayString,
      'dayOfWeek': BenekStringHelpers.getDayOfWeekAsString(dayOfWeek),
    };
  }
}