import 'package:benek/data/models/pet_models/pet_kind_model.dart';
import 'package:intl/intl.dart';

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

  static String getSmartFormattedDate(DateTime inputDate) {
    final now = DateTime.now();

    bool isSameDay(DateTime a, DateTime b) =>
        a.year == b.year && a.month == b.month && a.day == b.day;

    bool isSameWeek(DateTime a, DateTime b) {
      final startOfWeekA = a.subtract(Duration(days: a.weekday - 1));
      final startOfWeekB = b.subtract(Duration(days: b.weekday - 1));
      return isSameDay(startOfWeekA, startOfWeekB);
    }

    if (isSameDay(inputDate, now)) {
      return locale("today");
    } else if (isSameWeek(inputDate, now)) {
      return getDayOfWeekAsString(inputDate.weekday);
    } else if (inputDate.year == now.year) {
      return "${inputDate.day} ${getMonthAsString(inputDate.month)}";
    } else {
      return "${inputDate.day} ${getMonthAsString(inputDate.month)} ${inputDate.year}";
    }
  }


  static int getAgeAsInt(DateTime birthDate) {
    DateTime now = DateTime.now();
    int age = now.year - birthDate.year;
    if (now.month < birthDate.month ||
        (now.month == birthDate.month && now.day < birthDate.day)) {
      age--;
    }
    return age;
  }

  static String getPetGenderAsString(String sex){
    return locale(sex);
  }

  static String getPetKindAsString(PetKindModel petKind){
    String language = ui.PlatformDispatcher.instance.locale.languageCode;
    if( language == 'tr' || language == 'tr_TR' || language == 'TR' || language == 'Tr' ){
      return petKind.tr!;
    }
    return petKind.en!;
  }

  static formatDate(String date){
    DateFormat format = DateFormat('yyyy-MM-ddTHH:mm:ss.SSSZ');
    return format.parse(date);
  }

  static int calculateYearsDifference(DateTime pastDate) {
    DateTime now = DateTime.now();
    int yearsDifference = now.year - pastDate.year;

    if (now.month < pastDate.month ||
        (now.month == pastDate.month && now.day < pastDate.day)) {
      yearsDifference--;
    }

    return yearsDifference;
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
     String language = ui.PlatformDispatcher.instance.locale.languageCode;
     //  String language = 'en';
     if( language == 'tr' || language == 'tr_TR' || language == 'TR' || language == 'Tr' ){
       String? localizedText = AppStaticTextsTr.texts[key];
        return localizedText ?? key;
     }else{
       String? localizedText = AppStaticTextsEn.texts[key];
        return localizedText ?? key;
     }
  }

  static bool isLanguageTr(){
    String language = ui.PlatformDispatcher.instance.locale.languageCode;
    return language == 'tr' || language == 'tr_TR' || language == 'TR' || language == 'Tr';
  }

  static String formatPhoneNumber(String phoneNumber) {
    String formattedNumber = phoneNumber.replaceAllMapped(RegExp(r'^(\+\d{2})(\d{3})(\d{3})(\d{2})(\d{2})$'),
            (Match match) {
          return '${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}';
        });
    return formattedNumber;
  }

  static String formatNumberToReadable( int number ){
    switch (number) {
      case int n when n < 1000:
        return n.toString();
      case int n when n < 10000:
      // 1,000 - 9,999
        double result = n / 1000.0;
        return result == result.roundToDouble() ? '${result.round()} K' : '${result.toStringAsFixed(1)} K';
      case int n when n < 1000000:
      // 10,000 - 999,999
        double result = n / 1000.0;
        return result == result.roundToDouble() ? '${result.round()} K' : '${result.toStringAsFixed(1)} K';
      case int n when n < 1000000000:
      // 1,000,000 - 999,999,999
        double result = n / 1000000.0;
        return result == result.roundToDouble() ? '${result.round()} M' : '${result.toStringAsFixed(1)} M';
      case int n when n < 1000000000000:
      // 1,000,000,000 - 999,999,999,999
        double result = n / 1000000000.0;
        return result == result.roundToDouble() ? '${result.round()} B' : '${result.toStringAsFixed(1)} B';
      default:
      // 1,000,000,000,000 and above
        double result = number / 1000000000000.0;
        return result == result.roundToDouble() ? '${result.round()} T' : '${result.toStringAsFixed(1)} T';
    }
  }
}