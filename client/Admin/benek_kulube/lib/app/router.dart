import 'package:flutter/material.dart';
import 'app.dart';

class AppRouter {

  static void navigateToRoute(String routeName, BuildContext context, bool? isRemoveUntil) {
    if (isRemoveUntil == true) {
      Navigator.pushNamedAndRemoveUntil(context, routeName, (route) => false);
    } else {
      Navigator.pushReplacementNamed(context, routeName);
    }
  }

  static Route onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case '/':
        return MaterialPageRoute(builder: (_) => KulubeHomePage());
      case '/loginScreen':
        return MaterialPageRoute(builder: (_) => KulubeHomePage()); //LoginScreen());
      default:
        return MaterialPageRoute(builder: (_) => KulubeHomePage());
    }
  }
}