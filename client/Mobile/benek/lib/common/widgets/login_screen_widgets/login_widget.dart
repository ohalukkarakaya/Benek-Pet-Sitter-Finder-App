import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:benek/common/widgets/benek_small_button.dart';
import 'package:benek/common/widgets/benek_textfield.dart';
import 'package:benek/presentation/shared/components/benek_custom_modal_sheet/custom_modal_bottom_sheet.dart';
import 'package:flutter/material.dart';

class LoginWidget extends StatefulWidget {
  final dynamic Function()? defaultOnTap;
  final dynamic Function()? signupOnTap;

  const LoginWidget({
    super.key,
    this.defaultOnTap,
    this.signupOnTap
  });

  @override
  State<LoginWidget> createState() => _LoginWidgetState();
}

class _LoginWidgetState extends State<LoginWidget> {
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.85),
      ),
      child: Container(
        padding: EdgeInsets.symmetric(
            horizontal: 20.0, vertical: MediaQuery.of(context).padding.top),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                BenekSmallButton(
                  iconData: Icons.arrow_back_ios,
                  isLight: true,
                  size: 29,
                  iconSize: 9,
                  onTap: widget.defaultOnTap
                ),
                GestureDetector(
                  onTap: widget.signupOnTap,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      RichText(
                        text: TextSpan(
                          children: [
                            TextSpan(
                              text: "Hesabın yok mu?  ",
                              style: lightTextStyle(
                                textColor: AppColors.benekGrey,
                                textFontSize: 12,
                              ),
                            ),
                            TextSpan(
                              text: "Üye Ol",
                              style: regularTextStyle(
                                textColor: AppColors.benekWhite,
                                textFontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 5),
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Container(
                          height: 2.0,
                          width: 140,
                          decoration: const BoxDecoration(
                            gradient: LinearGradient(
                              colors: [AppColors.benekBlue, AppColors.benekWhite],
                              begin: Alignment.bottomLeft,
                              end: Alignment.topRight,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                )
              ],
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Giriş Yap",
                  style: TextStyle(
                    fontSize: 20.0,
                    fontFamily: defaultFontFamily(),
                    fontWeight: FontWeight.bold,
                    foreground: Paint()
                      ..shader = const LinearGradient(
                        colors: [AppColors.benekBlue, AppColors.benekWhite],
                        begin: Alignment.bottomLeft,
                        end: Alignment.topRight,
                      ).createShader(
                        const Rect.fromLTWH(0.0, 0.0, 200.0, 0.0),
                      ),
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  "Tekrar Hoş Geldin",
                  style: mediumTextStyle(
                      textColor: AppColors.benekWhite, textFontSize: 15),
                ),
                const SizedBox(height: 20),
                const BenekTextField(
                  hintText: "Email address",
                  keyboardType: TextInputType.emailAddress,
                ),
                const SizedBox(height: 16),
                const BenekTextField(
                  hintText: "Password",
                  obscureText: true,
                ),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    GestureDetector(
                      onTap: () => showCustomBlurBottomSheet(
                        context,
                        true,
                        Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Böyle şeyler herkesin başına gelebilir. Sana yardımcı olacağız. Lütfen e-posta adresini gir, sana geçici bir şifre göndereceğiz.",
                              style: mediumTextStyle(
                                  textColor: AppColors.benekGrey, textFontSize: 10),
                            ),
                            const SizedBox(height: 20),
                            const BenekTextField(
                              hintText: "Email adresi",
                              keyboardType: TextInputType.emailAddress,
                            ),
                            const SizedBox(height: 20),
                            const Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                BenekSmallButton(iconData: Icons.arrow_forward_ios, isLight: true,),
                              ],
                            )
                          ],
                        )
                      ),
                      child: Text(
                        "Şifreni mi unuttun?",
                        style: lightTextStyle(
                            textColor: AppColors.benekGrey, textFontSize: 12),
                      ),
                    ),
                    const BenekSmallButton(
                      iconData: Icons.arrow_forward_ios,
                      isLight: true,
                    )
                  ],
                )
              ],
            ),

            const SizedBox(),
          ],
        ),
      ),
    );
  }
}
