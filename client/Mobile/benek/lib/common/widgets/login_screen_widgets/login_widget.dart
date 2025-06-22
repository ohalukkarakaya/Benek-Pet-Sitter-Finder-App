import 'package:benek/common/utils/client_id.dart';
import 'package:flutter/material.dart';
import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/constants/benek_icons.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:benek/common/widgets/benek_small_button.dart';
import 'package:benek/common/widgets/benek_textfield.dart';
import 'package:benek/presentation/shared/components/benek_custom_modal_sheet/custom_modal_bottom_sheet.dart';

class LoginWidget extends StatefulWidget {
  final dynamic Function()? defaultOnTap;
  final dynamic Function()? signupOnTap;

  const LoginWidget({
    super.key,
    this.defaultOnTap,
    this.signupOnTap,
  });

  @override
  State<LoginWidget> createState() => _LoginWidgetState();
}

class _LoginWidgetState extends State<LoginWidget> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _forgetPasswordEmailController = TextEditingController();

  String _email = '';
  String _password = '';

  String _forgetPasswordEmail = "";

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
                      /// Üst Kısım: Geri Butonu + Üye Ol Linki
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
                                Container(
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
                              ],
                            ),
                          )
                        ],
                      ),
                      const SizedBox(height: 30),

                      /// Başlık
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
                          textColor: AppColors.benekWhite,
                          textFontSize: 15,
                        ),
                      ),
                      const SizedBox(height: 20),

                      /// TextField'lar
                      BenekTextField(
                        hintText: "Email address",
                        keyboardType: TextInputType.emailAddress,
                        controller: _emailController,
                        onChanged: (value) {
                          setState(() {
                            _email = value;
                          });
                        },
                      ),
                      const SizedBox(height: 16),
                      BenekTextField(
                        hintText: "Password",
                        obscureText: true,
                        controller: _passwordController,
                        onChanged: (value) {
                          setState(() {
                            _password = value;
                          });
                        },
                      ),
                      const SizedBox(height: 20),

                      /// Alt Satır: Şifremi unuttum + ileri butonu
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                                    "Böyle şeyler herkesin başına gelebilir. Sana yardımcı olacağız. "
                                    "Lütfen e-posta adresini gir, sana geçici bir şifre göndereceğiz.",
                                    style: mediumTextStyle(
                                      textColor: AppColors.benekGrey,
                                      textFontSize: 10,
                                    ),
                                  ),
                                  const SizedBox(height: 20),
                                  BenekTextField(
                                    hintText: "Email adresi",
                                    keyboardType: TextInputType.emailAddress,
                                    controller: _forgetPasswordEmailController,
                                    onChanged: (value) {
                                      setState(() {
                                        _forgetPasswordEmail = value;
                                      });
                                    },
                                  ),
                                  const SizedBox(height: 20),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.end,
                                    children: [
                                      BenekSmallButton(
                                        iconData: Icons.arrow_forward_ios,
                                        isLight: true,
                                        isPassive: !(_forgetPasswordEmail.contains("@") && _forgetPasswordEmail.contains(".com") && _forgetPasswordEmail.isNotEmpty),
                                        onTap: () async {
                                          // şifremi unuttum isteği atılabilir
                                        },
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                            child: Text(
                              "Şifreni mi unuttun?",
                              style: lightTextStyle(
                                textColor: AppColors.benekGrey,
                                textFontSize: 12,
                              ),
                            ),
                          ),
                          BenekSmallButton(
                            iconData: Icons.arrow_forward_ios,
                            isLight: true,
                            isPassive: !(_email.contains("@") && _email.contains(".com") && _email.isNotEmpty && _password.isNotEmpty),
                            onTap: () async {
                              String clientId = await getClientId();
                              //login isteği atabiliriz artık
                              print('email: ${ _email}, password: ${ _password}, clientId: ${clientId}');
                            },
                          )
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