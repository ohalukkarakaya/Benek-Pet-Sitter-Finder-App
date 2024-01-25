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
        return "Pazartesi";
      case 1:
        return "Salı";
      case 2:
        return "çarşamba";
      case 3:
        return "Perşembe";
      case 4:
        return "Cuma";
      case 5:
        return "Cumartesi";
      case 6:
        return "Pazar";
      default:
        return "";
    }
  }

  static getMonthAsString(int month) {
    switch (month) {
      case 1:
        return "Ocak";
      case 2:
        return "Subat";
      case 3:
        return "Mart";
      case 4:
        return "Nisan";
      case 5:
        return "Mayıs";
      case 6:
        return "Haziran";
      case 7:
        return "Temmuz";
      case 8:
        return "Agustos";
      case 9:
        return "Eylül";
      case 10:
        return "Ekim";
      case 11:
        return "Kasım";
      case 12:
        return "Aralık";
      default:
        return "";
    }
  }

  static String getUsersFullName( String firstName, String lastName, String? middleName){
    String  middleNameAsString = middleName != null ? "$middleName " : "";
    return "$firstName $middleNameAsString${lastName.toUpperCase()}";
  }
}