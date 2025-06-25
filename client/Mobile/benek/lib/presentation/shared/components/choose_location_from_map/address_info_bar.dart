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
    double screenWidth = MediaQuery.of(context).size.width;

    return Padding(
      padding: const EdgeInsets.only(left: 5.0),
      child: ConstrainedBox(
        constraints: BoxConstraints(
          minWidth: 50.0,
          maxWidth: isOpenAdress ? screenWidth - 40 : screenWidth * 0.5,
        ),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 12.0),
          decoration: BoxDecoration(
            color: AppColors.benekBlack.withOpacity(0.8),
            borderRadius: const BorderRadius.all(Radius.circular(6.0)),
          ),
          child: Text(
            infoText,
            style: isOpenAdress
                ? regularTextStyle(
                    textColor: AppColors.benekWhite,
                    textFontSize: 13.0,
                  )
                : boldTextStyle(
                    textColor: AppColors.benekWhite,
                    textFontSize: 14.0,
                  ),
            overflow: TextOverflow.ellipsis,
            maxLines: 1,
            textAlign: TextAlign.left,
          ),
        ),
      ),
    );
  }
}
