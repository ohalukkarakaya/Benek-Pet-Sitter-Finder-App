import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class LocationWarningWidget extends StatelessWidget {
  const LocationWarningWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 30.0, left: 20),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(6.0),
        child: Container(
          width: 500,
          height: 80,
          color: AppColors.benekBlack.withOpacity(0.8), // Açık turuncu arkaplan rengi
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Container(
                width: 5.0, // Sol taraf ince koyu turuncu dikdörtgen
                height: 80.0,
                color: AppColors.benekWarningOrange, // Koyu turuncu renk
              ),
              Padding(
                padding: const EdgeInsets.all(10.0),
                child: SizedBox(
                  width: 450.0,
                  height: 80,
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(
                        Icons.warning_rounded, // Uyarı ikonu
                        color: AppColors.benekWarningOrange, // Koyu turuncu renk
                      ),
                      const SizedBox(width: 10.0), // Boşluk
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                                BenekStringHelpers.locale('chooseYourLocationCaption'), // Başlık
                                style: boldTextStyle(
                                  textColor: AppColors.benekWarningOrange, // Koyu turuncu renk
                                  textFontSize: 14.0,
                                )
                            ),
                            SizedBox(height: 5.0), // Başlık ile açıklama arası boşluk
                            Text(
                                BenekStringHelpers.locale('chooseYourLocationDesc'), // Açıklama
                                style: regularTextStyle(
                                  textColor: AppColors.benekWhite,
                                )
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
