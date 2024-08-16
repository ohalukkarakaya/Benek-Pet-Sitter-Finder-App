class CustomException implements Exception {
  final int code;
  final String message;

  CustomException([this.code = 0, this.message = ""]);

  @override
  String toString() {
    if (message.isEmpty) return "CustomException";
    return "CustomException: code: $code -> $message";
  }
}
