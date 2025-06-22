import 'package:benek/common/constants/benek_icons.dart';
import 'package:benek/common/utils/show_pdf_modal_sheet.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:benek/common/widgets/benek_small_button.dart';
import 'package:benek/common/widgets/benek_textfield.dart';
import 'package:benek/common/widgets/login_screen_widgets/gender_selector_widget.dart';

class SignupWidget extends StatefulWidget {
  final dynamic Function()? defaultOnTap;
  final dynamic Function()? loginOnTap;

  const SignupWidget({
    super.key,
    this.defaultOnTap,
    this.loginOnTap,
  });

  @override
  State<SignupWidget> createState() => _SignupWidgetState();
}

class _SignupWidgetState extends State<SignupWidget> {
  Gender _selectedGender = Gender.male;
  bool _isConsentGiven = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black.withOpacity(0.85),
      resizeToAvoidBottomInset: true,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 20,
              ),
              child: ConstrainedBox(
                constraints: BoxConstraints(minHeight: constraints.maxHeight),
                child: IntrinsicHeight(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      /// Üstteki header
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          BenekSmallButton(
                            iconData: BenekIcons.left,
                            isLight: true,
                            size: 29,
                            iconSize: 9,
                            onTap: widget.defaultOnTap,
                          ),
                          GestureDetector(
                            onTap: widget.loginOnTap,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                RichText(
                                  text: TextSpan(
                                    children: [
                                      TextSpan(
                                        text: "Hesabın var mı?  ",
                                        style: lightTextStyle(
                                          textColor: AppColors.benekGrey,
                                          textFontSize: 12,
                                        ),
                                      ),
                                      TextSpan(
                                        text: "Giriş Yap",
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
                                        colors: [
                                          AppColors.benekBlue,
                                          AppColors.benekWhite
                                        ],
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
                      const SizedBox(height: 30),

                      /// Başlık
                      Text(
                        "Üye Ol",
                        style: TextStyle(
                          fontSize: 20.0,
                          fontFamily: defaultFontFamily(),
                          fontWeight: FontWeight.bold,
                          foreground: Paint()
                            ..shader = const LinearGradient(
                              colors: [
                                AppColors.benekBlue,
                                AppColors.benekWhite
                              ],
                              begin: Alignment.bottomLeft,
                              end: Alignment.topRight,
                            ).createShader(
                                const Rect.fromLTWH(0.0, 0.0, 200.0, 0.0)),
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        "Benek Hesabını oluştur",
                        style: mediumTextStyle(
                          textColor: AppColors.benekWhite,
                          textFontSize: 15,
                        ),
                      ),
                      const SizedBox(height: 20),

                      /// TextField'lar
                      const BenekTextField(hintText: "Kullanıcı adı"),
                      const SizedBox(height: 16),
                      const BenekTextField(hintText: "Email address"),
                      const SizedBox(height: 16),
                      const BenekTextField(hintText: "Kimlikte yazan tam isim"),
                      const SizedBox(height: 16),
                      GenderSelector(
                        selectedGender: _selectedGender,
                        onChanged: (gender) {
                          setState(() {
                            _selectedGender = gender;
                          });
                        },
                      ),
                      const SizedBox(height: 16),
                      const BenekTextField(
                          hintText: "Password", obscureText: true),
                      const SizedBox(height: 20),

                      /// Alt kısım
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Align(
                              alignment: Alignment
                                  .centerLeft, // ✅ Yatayda sola yapıştır
                              child: IntrinsicWidth(
                                // ✅ Taşmadan sar
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisAlignment: MainAxisAlignment.start,
                                  children: [
                                    Checkbox(
                                      value: _isConsentGiven,
                                      onChanged: (value) {
                                        setState(() {
                                          _isConsentGiven = value ?? false;
                                        });
                                      },
                                      activeColor: AppColors.benekBlue,
                                      materialTapTargetSize:
                                          MaterialTapTargetSize.shrinkWrap,
                                      visualDensity: const VisualDensity(
                                          horizontal: -4, vertical: -4),
                                    ),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: RichText(
                                        text: TextSpan(
                                          style: lightTextStyle(
                                            textColor: AppColors.benekGrey,
                                            textFontSize: 12,
                                          ),
                                          children: [
                                            const TextSpan(
                                              text: "Aşağıdaki belgeleri okudum ve kabul ediyorum: ",
                                            ),
                                            TextSpan(
                                              text: "Hizmet Sözleşmesi",
                                              style: regularTextStyleUnderLine(
                                                  textColor:AppColors.benekBlue,
                                                  textFontSize: 12),
                                              recognizer: TapGestureRecognizer()
                                                ..onTap = () {
                                                  showPdfModalSheet(context, 'assets/sozlesmeler/Benek Hizmet Sozlesmesi.pdf');
                                                },
                                            ),
                                            const TextSpan(text: ", "),
                                            TextSpan(
                                              text:
                                                  "Kişisel Verilerin Korunması Açık Rıza Metni ve Beyanı",
                                              style: regularTextStyleUnderLine(
                                                  textColor:
                                                      AppColors.benekBlue,
                                                  textFontSize: 12),
                                              recognizer: TapGestureRecognizer()
                                                ..onTap = () {
                                                  showPdfModalSheet(context, 'assets/sozlesmeler/Kişisel Verilerin Korunması  “Açık Rıza Beyanı”.pdf');
                                                },
                                            ),
                                            const TextSpan(text: ", "),
                                            TextSpan(
                                              text:
                                                  "Kullanıcı Aydınlatma Metni",
                                              style: regularTextStyleUnderLine(
                                                  textColor:
                                                      AppColors.benekBlue,
                                                  textFontSize: 12),
                                              recognizer: TapGestureRecognizer()
                                                ..onTap = () {
                                                  showPdfModalSheet(context, 'assets/sozlesmeler/Kişisel Verilerin Korunması-  Kullanıcı Aydınlatma Metni .pdf');
                                                },
                                            ),
                                            const TextSpan(text: ", "),
                                            TextSpan(
                                              text: "Gizlilik Politikamız",
                                              style: regularTextStyleUnderLine(
                                                  textColor:
                                                      AppColors.benekBlue,
                                                  textFontSize: 12),
                                              recognizer: TapGestureRecognizer()
                                                ..onTap = () {
                                                  showPdfModalSheet(context, 'assets/sozlesmeler/Kişisel Verilerin Korunması ve Gizlilik Politikası.pdf');
                                                },
                                            ),
                                            const TextSpan(text: "."),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          const BenekSmallButton(
                            iconData: Icons.arrow_forward_ios,
                            isLight: true,
                          ),
                        ],
                      ),

                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
