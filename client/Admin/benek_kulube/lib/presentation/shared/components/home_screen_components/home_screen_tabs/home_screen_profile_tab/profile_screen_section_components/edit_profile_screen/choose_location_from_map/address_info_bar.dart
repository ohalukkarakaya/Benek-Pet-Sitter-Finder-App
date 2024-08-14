import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:flutter/widgets.dart';
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
    return Padding(
      padding: const EdgeInsets.only(left: 5.0),
      child: ConstrainedBox(
        constraints: BoxConstraints(
          minWidth: 50.0,
          maxWidth: isOpenAdress ? 550.0 : double.infinity,
        ),
        child: Container(
          height: 60.0,
          alignment: Alignment.bottomLeft,
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 20.0),
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
            overflow: TextOverflow.ellipsis, // Taşmayı önler ve ... ile keser
            maxLines: 1, // Tek satırda gösterir
            textAlign: TextAlign.left,
          ),
        ),
      ),
    );
  }
}