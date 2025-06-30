import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:flutter/material.dart';

import '../../presentation/shared/components/loading_components/benek_blured_modal_barier.dart';
import '../constants/app_colors.dart';
import '../utils/styles.text.dart';
import 'approve_screen.dart';
import 'benek_horizontal_button.dart';

class ResetPasswordInfoPage extends StatefulWidget {
  final Future<void> Function() onDispatch;

  const ResetPasswordInfoPage({
    super.key,
    required this.onDispatch,
  });

  @override
  State<ResetPasswordInfoPage> createState() => _ResetPasswordInfoPageState();
}

class _ResetPasswordInfoPageState extends State<ResetPasswordInfoPage> {
  @override
  Widget build(BuildContext context) {
    // Container genişliği dinamik: ekran %90, max 500
    final containerWidth = MediaQuery.of(context).size.width * 0.9 > 500
        ? 500
        : MediaQuery.of(context).size.width * 0.9;

    // Button genişliği dinamik: ekran %80, max 450
    final buttonWidth = MediaQuery.of(context).size.width * 0.8 > 450
        ? 450
        : MediaQuery.of(context).size.width * 0.8;

    return BenekBluredModalBarier(
      isDismissible: true,
      onDismiss: () async {
        Navigator.of(context).pop();
      },
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Center(
          child: Container(
            height: 200,
            width: containerWidth.toDouble(),
            padding: const EdgeInsets.only(
              left: 16.0,
              top: 16.0,
              bottom: 16.0,
              right: 16.0,
            ),
            decoration: BoxDecoration(
              color: AppColors.benekBlack,
              borderRadius: const BorderRadius.all(Radius.circular(6.0)),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Başlık
                Text(
                  BenekStringHelpers.locale('resetPassword'),
                  style: mediumTextStyle(textColor: AppColors.benekWhite),
                ),

                // Açıklama
                Wrap(
                  children: [
                    Text(
                      BenekStringHelpers.locale('resetPasswordInfo'),
                      style: regularTextStyle(textColor: AppColors.benekWhite),
                    ),
                  ],
                ),

                // Buton
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    BenekHorizontalButton(
                      text: BenekStringHelpers.locale('resetPasswordAndLogout'),
                      isLight: true,
                      width: buttonWidth.toDouble(),
                      onTap: () async {
                        bool didApprove = await Navigator.push(
                          context,
                          PageRouteBuilder(
                            opaque: false,
                            barrierDismissible: false,
                            pageBuilder: (context, _, __) => ApproveScreen(title: BenekStringHelpers.locale('forgetPasswordApproveMessage')),
                          ),
                        );

                        if (didApprove != true) return;

                        widget.onDispatch();

                        Navigator.of(context).pop();
                        Navigator.of(context).pop();
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
