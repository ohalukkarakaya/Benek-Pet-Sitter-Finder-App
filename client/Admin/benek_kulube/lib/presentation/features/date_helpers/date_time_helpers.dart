import 'package:intl/intl.dart';

class DateTimeHelpers {
  static String getFormattedDate(DateTime date) {
    return DateFormat('dd MMM yyyy').format(date);
  }

  static String getFormattedTime(DateTime date) {
    return DateFormat('hh:mm a').format(date);
  }

  static String getFormattedDateTime(DateTime date) {
    return '${getFormattedDate(date)} ${getFormattedTime(date)}';
  }

  static DateTime getDateTime(String date) {
    if (date.contains('T')) {
      return DateTime.parse(date);
    } else {
      DateFormat format = DateFormat('yyyy-MM-ddTHH:mm:ssZ');
      return format.parse(date);
    }
  }
}