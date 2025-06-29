import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:flutter/material.dart';

import 'package:toastification/toastification.dart';

import '../constants/app_colors.dart';
import '../constants/benek_icons.dart';
import 'styles.text.dart';

class BenekToastHelper {
  static int maxMessageCharacter = 50;

  static ToastificationItem showSuccessToast(String caption, String desc, BuildContext context) {
    // Show success toast
    return toastification.show(
        context: context,
        type: ToastificationType.success,
        style: ToastificationStyle.flatColored,
        title: Text(
            caption,
            style: mediumTextStyle()
        ),
        description: Text(
            BenekStringHelpers.getStringWithCharacterLimit(desc, maxMessageCharacter),
            style: lightTextStyle()
        ),
        alignment: Alignment.topRight,
        autoCloseDuration: const Duration(seconds: 3),
        primaryColor: AppColors.benekSuccessGreen,
        backgroundColor: AppColors.benekLightGreen,
        icon: const Icon(BenekIcons.checkcircle),
        borderRadius: BorderRadius.circular(12.0),
        boxShadow: lowModeShadow,
        showProgressBar: false,
        closeButtonShowType: CloseButtonShowType.onHover,
        dragToClose: true,
        closeOnClick: true,
        pauseOnHover: true
    );
  }

  static ToastificationItem showErrorToast(String caption, String desc, BuildContext? context) {
    // Show error toast
    return toastification.show(
        context: context,
        type: ToastificationType.error,
        style: ToastificationStyle.flatColored,
        title: Text(
            caption,
            style: mediumTextStyle()
        ),
        description: Text(
            BenekStringHelpers.getStringWithCharacterLimit(desc, maxMessageCharacter),
            style: lightTextStyle()
        ),
        alignment: Alignment.topRight,
        autoCloseDuration: const Duration(seconds: 3),
        primaryColor: AppColors.benekRed,
        backgroundColor: AppColors.benekLightRed,
        icon: const Icon(BenekIcons.timescircle),
        borderRadius: BorderRadius.circular(12.0),
        boxShadow: lowModeShadow,
        showProgressBar: false,
        closeButtonShowType: CloseButtonShowType.onHover,
        dragToClose: true,
        closeOnClick: true,
        pauseOnHover: true
    );
  }
}