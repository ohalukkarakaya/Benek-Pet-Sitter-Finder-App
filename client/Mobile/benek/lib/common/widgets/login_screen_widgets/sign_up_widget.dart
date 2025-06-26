import 'dart:ui';

import 'package:benek/common/constants/benek_icons.dart';
import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/constants/turkish_cities_data_list.dart';
import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/benek_toast_helper.dart';
import 'package:benek/common/utils/client_id.dart';
import 'package:benek/common/utils/show_md_modal_sheet.dart';
import 'package:benek/common/utils/state_utils/auth_utils/auth_utils.dart';
import 'package:benek/common/widgets/login_screen_widgets/password_text_field.dart';
import 'package:benek/data/models/city_data_model.dart';
import 'package:benek/data/services/api.dart';
import 'package:benek/redux/login_and_signup/login.action.dart';
import 'package:benek/redux/login_and_signup/signup.action.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:benek/common/widgets/benek_small_button.dart';
import 'package:benek/common/widgets/benek_textfield.dart';
import 'package:benek/common/widgets/login_screen_widgets/gender_selector_widget.dart';
import 'package:benek/common/widgets/benek_dropdown_field.dart';

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
  final TextEditingController _userNameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _fullnameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  String _username = "";
  String _email = "";
  String _fullname = "";
  String _password = "";

  City? _selectedCity;
  String _city = '';
  String _lat = '';
  String _lng = '';

  Gender _selectedGender = Gender.male;
  bool _isConsentGiven = false;

  List<String>? _isimler;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.benekBlack.withAlpha(217),
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
                      /// Header
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
                              const Rect.fromLTWH(0.0, 0.0, 200.0, 0.0),
                            ),
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

                      /// TextFields
                      BenekTextField(
                        hintText: "Kullanıcı adı",
                        controller: _userNameController,
                        onChanged: (value) {
                          setState(() {
                            _username = value;
                          });
                        },
                      ),
                      const SizedBox(height: 16),
                      BenekTextField(
                        hintText: "Email address",
                        controller: _emailController,
                        onChanged: (value) {
                          setState(() {
                            _email = value;
                          });
                        },
                      ),
                      const SizedBox(height: 16),
                      BenekTextField(
                        hintText: "Kimlikte yazan tam isim",
                        controller: _fullnameController,
                        onChanged: (value) {
                          setState(() {
                            _fullname = value;
                            _isimler = _fullname.split(" ");
                          });
                        },
                      ),
                      const SizedBox(height: 16),

                      BenekModalPickerField<City>(
                        hintText: "İkamet ettiğiniz şehri seçiniz",
                        value: _selectedCity,
                        options: turkishCities,
                        display: (city) {
                          final postalCode = city.code.toString().padLeft(2, '0');
                          return Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    city.name,
                                    style: regularTextStyle(
                                      textColor: AppColors.benekWhite,
                                      textFontSize: 15
                                    ),
                                  ),
                                  const SizedBox( width: 10, ),
                                  Text(
                                    postalCode,
                                    style: regularTextStyle(
                                      textColor: AppColors.benekWhite,
                                      textFontSize: 15
                                    ),  
                                  )
                                ],
                              );
                        },
                        onChanged: (selectedCity) {
                          final center = getCityCenterLatLng(selectedCity!);

                          setState(() {
                            _selectedCity = selectedCity;
                            _city = selectedCity.name;
                            _lat = center['lat']!.toString();
                            _lng = center['lng']!.toString();
                          });
                        },
                      ),

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

                      /// Alt kısım (Checkbox + Buton)
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
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
                                          text:
                                              "Aşağıdaki belgeleri okudum ve kabul ediyorum: ",
                                        ),
                                        TextSpan(
                                          text: "Hizmet Sözleşmesi",
                                          style: regularTextStyleUnderLine(
                                            textColor: AppColors.benekBlue,
                                            textFontSize: 12,
                                          ),
                                          recognizer: TapGestureRecognizer()
                                            ..onTap = () {
                                              showMarkdownModalSheet(context,
                                                  'assets/sozlesmeler/benek_hizmet_sozlesmesi.md');
                                            },
                                        ),
                                        const TextSpan(text: ", "),
                                        TextSpan(
                                          text:
                                              "Kişisel Verilerin Korunması Açık Rıza Metni ve Beyanı",
                                          style: regularTextStyleUnderLine(
                                              textColor: AppColors.benekBlue,
                                              textFontSize: 12),
                                          recognizer: TapGestureRecognizer()
                                            ..onTap = () {
                                              showMarkdownModalSheet(context,
                                                  'assets/sozlesmeler/kisisel_verilerin_korunmasi_acik_riza_beyani.md');
                                            },
                                        ),
                                        const TextSpan(text: ", "),
                                        TextSpan(
                                          text: "Kullanıcı Aydınlatma Metni",
                                          style: regularTextStyleUnderLine(
                                              textColor: AppColors.benekBlue,
                                              textFontSize: 12),
                                          recognizer: TapGestureRecognizer()
                                            ..onTap = () {
                                              showMarkdownModalSheet(context,
                                                  'assets/sozlesmeler/kisisel_verilerin_korunmasi_kullanici_aydinlatma_metni.md');
                                            },
                                        ),
                                        const TextSpan(text: ", "),
                                        TextSpan(
                                          text: "Gizlilik Politikamız",
                                          style: regularTextStyleUnderLine(
                                              textColor: AppColors.benekBlue,
                                              textFontSize: 12),
                                          recognizer: TapGestureRecognizer()
                                            ..onTap = () {
                                              showMarkdownModalSheet(context,
                                                  'assets/sozlesmeler/kisisel_verilerin_korunmasi_ve_gizlilik_politikasi.md');
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
                          const SizedBox(width: 10),
                          BenekSmallButton(
                            iconData: Icons.arrow_forward_ios,
                            isLight: true,
                            isPassive: !(_username.isNotEmpty &&
                                _email.contains("@") &&
                                _email.contains(".com") &&
                                _isimler != null &&
                                _isimler!.length > 1 &&
                                _password.isNotEmpty &&
                                _isConsentGiven &&
                                _city.isNotEmpty),
                            onTap: () async {
                              String clientId = await getClientId();

                              String? firstname = _isimler![0];
                              String? middlename =
                                  _isimler!.length > 2 ? _isimler![1] : null;
                              String? lastname = _isimler!.length > 2
                                  ? _isimler![2]
                                  : _isimler![1];

                              var result = await signUpAction(
                                _username,
                                _email,
                                _selectedGender,
                                firstname,
                                lastname,
                                _city,
                                _lat,
                                _lng,
                                _password,
                                clientId,
                                middlename,
                              );

                              if (!(result['success'] ?? true)) {
                                BenekToastHelper.showErrorToast(
                                  BenekStringHelpers.locale('operationFailed'),
                                  result["message"],
                                  context,
                                );
                                return;
                              }

                              // print('--- Signup Form Values ---');
                              // print('Username: $_username');
                              // print('Email: $_email');
                              // print('Gender: $_selectedGender');
                              // print('Firstname: $firstname');
                              // print('Lastname: $lastname');
                              // print('City: $_city');
                              // print('Latitude: $_lat');
                              // print('Longitude: $_lng');
                              // print('Password: $_password');
                              // print('Client ID: $clientId');
                              // print('Middlename: $middlename');
                              // print('---------------------------');

                              // Başarılı ise ne yapılacağı

                              showModalBottomSheet(
                                    context: context,
                                    isScrollControlled: true,
                                    backgroundColor: Colors.transparent,
                                    barrierColor: Colors.transparent,
                                    builder: (context) {
                                      return GestureDetector(
                                        behavior: HitTestBehavior.opaque,
                                        onTap: () =>
                                            FocusScope.of(context).unfocus(),
                                        child: LayoutBuilder(
                                          builder: (context, constraints) {
                                            return Stack(
                                              children: [
                                                // 🔹 BLUR
                                                Positioned.fill(
                                                  child: BackdropFilter(
                                                    filter: ImageFilter.blur(
                                                        sigmaX: 10, sigmaY: 10),
                                                    child: Container(
                                                      color: AppColors
                                                          .benekBlack
                                                          .withAlpha(77),
                                                    ),
                                                  ),
                                                ),

                                                // 🔹 KONTROLLÜ YÜKSEKLİK (yalnızca içerik kadar)
                                                Align(
                                                  alignment:
                                                      Alignment.bottomCenter,
                                                  child: AnimatedPadding(
                                                    duration: const Duration(
                                                        milliseconds: 150),
                                                    curve: Curves.easeOut,
                                                    padding: EdgeInsets.only(
                                                      bottom:
                                                          MediaQuery.of(context)
                                                              .viewInsets
                                                              .bottom,
                                                    ),
                                                    child: IntrinsicHeight(
                                                      child: Container(
                                                        decoration:
                                                            const BoxDecoration(
                                                          color: Colors.black,
                                                          borderRadius:
                                                              BorderRadius
                                                                  .vertical(
                                                            top:
                                                                Radius.circular(
                                                                    20),
                                                          ),
                                                        ),
                                                        padding:
                                                            const EdgeInsets
                                                                .all(24.0),
                                                        child:
                                                            PasswordTextfield(
                                                                message:
                                                                    "Epostana bir kod gönderdik :) "
                                                                    "Lütfen e-postanı kontrol et ve kodu gir.",
                                                                verifyingString:
                                                                    _email,
                                                                onDispatch: (String
                                                                    code) async {
                                                                  print(
                                                                      "Kullanıcı kod girdi: $code");

                                                                  bool
                                                                      isSuccesful =
                                                                      await UserInfoApi().postVerifyEmailOtpTrustedId(
                                                                              code,
                                                                              _email,
                                                                              clientId) ??
                                                                          false;

                                                                  if (!isSuccesful) {
                                                                    BenekToastHelper
                                                                        .showErrorToast(
                                                                      BenekStringHelpers
                                                                          .locale(
                                                                              'Error'),
                                                                      "Hata oluştu!",
                                                                      context,
                                                                    );
                                                                    return;
                                                                  }

                                                                  // Modal'ı kapat
                                                                  Navigator.of(
                                                                          context)
                                                                      .pop();

                                                                  // Biraz bekle, sonra tekrar login olmaya çalış
                                                                  await Future.delayed(
                                                                      const Duration(
                                                                          milliseconds:
                                                                              300));

                                                                  var result = await loginAction(
                                                                      _email,
                                                                      _password,
                                                                      clientId
                                                                  );

                                                                  if (result['success'] ==  true) {
                                                                    AuthUtils.setCredentials();
                                                                  } else {
                                                                    BenekToastHelper.showErrorToast(
                                                                      BenekStringHelpers.locale('Error'),
                                                                      "Email veya şifre hatalı!",
                                                                      context,
                                                                    );
                                                                  }
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
                            },
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
