import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:flutter/material.dart';
import 'package:benek_kulube/store/app_state.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import '../../../common/utils/styles.text.dart';

class NoInternetConnectionScreen extends StatelessWidget {
  final Store<AppState> store;

  const NoInternetConnectionScreen({
    super.key,
    required this.store,
  });

  @override
  Widget build(BuildContext context) {

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                width: MediaQuery.of(context).size.width,
                height: MediaQuery.of(context).size.height,
              ),
              // Arkadaki kalın "HATA" yazısı
              Positioned(
                bottom: 5,
                child: Text(
                  BenekStringHelpers.locale('errorCapital'),
                  style: TextStyle(
                    fontSize: 350,
                    fontWeight: getFontWeight('black'),
                    color: AppColors.benekBlack.withOpacity(0.5),
                    letterSpacing: 10,
                    fontFamily: defaultFontFamily(),
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              // Öndeki köpek görseli
              Center(
                child: Image.asset(
                  'assets/images/internet_connection_lost.png',
                  height: MediaQuery.of(context).size.height / 1.5,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
