import 'dart:ui';

import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/widgets/login_screen_widgets/password_text_field.dart';

import 'package:flutter/material.dart';

/// Tek satırda kolayca çağrılabilen, reusable bir bottom‑sheet.
///
/// ```dart
/// await PasswordWidget.show(
///   context: context,
///   email: _email,
///   password: _password,
///   clientId: clientId,
///   loginAction: loginAction,
/// );
/// ```
class PasswordWidget {
  /// Şifre doğrulama bottom‑sheet’ini gösterir.
  static Future<T?> show<T>({
    required BuildContext context,
    String? verifyingString,
    required Future<void> Function(String) onDispatch,
  }) {
    return showModalBottomSheet<T>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      barrierColor: Colors.transparent,
      builder: (_) => _PasswordSheet(
        verifyingString: verifyingString,
        onDispatch: onDispatch,
      ),
    );
  }
}

/// Bottom‑sheet’in asıl içeriğini oluşturan **private** widget.
class _PasswordSheet extends StatelessWidget {
  final String? verifyingString;
  final Future<void> Function(String) onDispatch;

  const _PasswordSheet({
    this.verifyingString,
    required this.onDispatch,
});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: () => FocusScope.of(context).unfocus(),
      child: LayoutBuilder(
        builder: (context, constraints) {
          return Stack(
            children: [
              // 🔹 BLUR layer
              Positioned.fill(
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                  child: Container(
                    color: AppColors.benekBlack.withAlpha(77),
                  ),
                ),
              ),
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
                        message: 'Görünüşe göre farklı bir cihazdan giriş yapıyorsun. Güvenliğin için e‑postana bir kod gönderdik. Lütfen e‑postanı kontrol et ve kodu gir.',
                        verifyingString: verifyingString ?? "",
                        onDispatch: (String code) => onDispatch( code ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
