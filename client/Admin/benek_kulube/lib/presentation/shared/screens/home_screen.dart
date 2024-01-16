import 'package:flutter/material.dart';

import '../components/home_screen_components/home_screen_grid.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      child: const HomeScreenGrid()
    );
  }
}
