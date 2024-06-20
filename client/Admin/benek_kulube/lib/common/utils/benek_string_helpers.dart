import '../constants/app_static_texts/app_static_texts.en.dart';
import '../constants/app_static_texts/app_static_texts.tr.dart';
import 'dart:ui' as ui;

class BenekStringHelpers {
  static String trimSpaces(String input) {
    // Başındaki boşluk karakterlerini temizle
    int startIndex = 0;
    while (startIndex < input.length && input[startIndex] == ' ') {
      startIndex++;
    }

    // Sonundaki boşluk karakterlerini temizle
    int endIndex = input.length - 1;
    while (endIndex > 0 && input[endIndex] == ' ') {
      endIndex--;
    }

    // Başındaki ve sonundaki boşluk karakterlerini sil
    return input.substring(startIndex, endIndex + 1);
  }

  static String getDayOfWeekAsString(int day) {
    switch (day - 1) {
      case 0:
        return locale('monday');
      case 1:
        return locale('tuesday');
      case 2:
        return locale('wednesday');
      case 3:
        return locale('thursday');
      case 4:
        return locale('friday');
      case 5:
        return locale('saturday');
      case 6:
        return locale('sunday');
      default:
        return "";
    }
  }

  static getMonthAsString(int month) {
    switch (month) {
      case 1:
        return locale('january');
      case 2:
        return locale('february');
      case 3:
        return locale('march');
      case 4:
        return locale('april');
      case 5:
        return locale('may');
      case 6:
        return locale('june');
      case 7:
        return locale('july');
      case 8:
        return locale('august');
      case 9:
        return locale('september');
      case 10:
        return locale('october');
      case 11:
        return locale('november');
      case 12:
        return locale('december');
      default:
        return "";
    }
  }

  static String getDateAsString(DateTime date) {
    return "${date.day} ${getMonthAsString(date.month)} ${date.year}";
  }

  static String getUsersFullName( String firstName, String lastName, String? middleName){
    String  middleNameAsString = middleName != null ? "$middleName " : "";
    return "$firstName $middleNameAsString${lastName.toUpperCase()}";
  }

  static String getStringWithCharacterLimit( String text, int maxCharCount ){
    if( text.length > maxCharCount ){
      return "${text.substring(0, maxCharCount)}...";
    }
    return text;
  }

  static String locale(String key){
     String language = ui.window.locale.languageCode;
     //  String language = 'en';
     if( language == 'tr' || language == 'tr_TR' || language == 'TR' || language == 'Tr' ){
       String? localizedText = AppStaticTextsTr.texts[key];
        return localizedText ?? key;
     }else{
       String? localizedText = AppStaticTextsEn.texts[key];
        return localizedText ?? key;
     }
  }

  static String formatPhoneNumber(String phoneNumber) {
    String formattedNumber = phoneNumber.replaceAllMapped(RegExp(r'^(\+\d{2})(\d{3})(\d{3})(\d{2})(\d{2})$'),
            (Match match) {
          return '${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}';
        });
    return formattedNumber;
  }
}