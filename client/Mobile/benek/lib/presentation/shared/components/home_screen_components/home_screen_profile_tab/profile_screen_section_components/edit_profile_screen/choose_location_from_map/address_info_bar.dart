import 'package:benek/common/utils/styles.text.dart';
import 'package:flutter/material.dart';

import '../../../../../../../../../common/constants/app_colors.dart';

class InfoBar extends StatelessWidget {
  final bool isOpenAdress;
  final String infoText;

  const InfoBar({
    super.key,
    this.isOpenAdress = false,
    required this.infoText,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: BoxConstraints(
        minWidth: 50.0,
        maxWidth: isOpenAdress ? 550.0 : 200.0, // 👈 Şehir ve ülke için 200 sabit
      ),
      height: 60.0,
      alignment: Alignment.bottomLeft,
      padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 20.0),
      decoration: BoxDecoration(
        color: AppColors.benekBlack.withOpacity(0.8),
        borderRadius: const BorderRadius.all(Radius.circular(6.0)),
      ),
      child: Text(
        infoText,
        style: isOpenAdress
            ? regularTextStyle(
                textColor: AppColors.benekWhite,
                textFontSize: 14.0,
              )
            : boldTextStyle(
                textColor: AppColors.benekWhite,
                textFontSize: 15.0,
              ),
        overflow: TextOverflow.ellipsis,
        maxLines: 1,
        textAlign: TextAlign.left,
      ),
    );
  }
}