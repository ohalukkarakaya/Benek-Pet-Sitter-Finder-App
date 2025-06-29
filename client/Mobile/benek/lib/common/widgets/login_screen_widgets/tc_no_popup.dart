import 'dart:ui';

import 'package:benek/common/constants/app_colors.dart';

import 'package:benek/common/widgets/login_screen_widgets/password_text_field.dart';

import 'package:flutter/material.dart';

Future<String?> showTcKimlikPopup(BuildContext context) {
  return showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    barrierColor: Colors.transparent,
    builder: (context) {
      return GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: () => FocusScope.of(context).unfocus(),
        child: LayoutBuilder(
          builder: (context, constraints) {
            return Stack(
              children: [
                // 🔹 BLUR
                Positioned.fill(
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                    child: Container(
                      color: AppColors.benekBlack.withAlpha(77),
                    ),
                  ),
                ),

                // 🔹 KONTROLLÜ YÜKSEKLİK (yalnızca içerik kadar)
                Align(
                  alignment: Alignment.bottomCenter,
                  child: AnimatedPadding(
                    duration: const Duration(milliseconds: 150),
                    curve: Curves.easeOut,
                    padding: EdgeInsets.only(
                      bottom: MediaQuery.of(context).viewInsets.bottom,
                    ),
                    child: IntrinsicHeight(
                      child: Container(
                        decoration: const BoxDecoration(
                          color: Colors.black,
                          borderRadius: BorderRadius.vertical(
                            top: Radius.circular(20),
                          ),
                        ),
                        padding: const EdgeInsets.all(24.0),
                        child: PasswordTextfield(
                            message:
                                "Vergi yükümlülükleri gereği ve Türkiye Cumhuriyeti vatandaşı olduğunuzu kanıtlamak amacıyla T.C. Kimlik Numaranızı almak zorundayız. "
                                "Bu bilgi yalnızca resmi işlemler için kullanılır ve Benek çalışanları da dahil olmak üzere hiçbir yetkisiz kişiyle paylaşılmaz.",
                            verifyingString: "",
                            isResendButtonActive: false,
                            passwordCharacterCount: 11,
                            onDispatch: (String code) async {
                              print("Kullanıcı kod girdi: $code");

                              // Modal'ı kapat
                              Navigator.of(context).pop(code);
                            }),
                      ),
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      );
    },
  );
}
