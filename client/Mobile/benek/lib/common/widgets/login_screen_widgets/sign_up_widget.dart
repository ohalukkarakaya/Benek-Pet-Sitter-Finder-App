import 'package:benek/common/constants/benek_icons.dart';
import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/benek_toast_helper.dart';
import 'package:benek/common/utils/client_id.dart';
import 'package:benek/common/utils/get_current_location_helper.dart';
import 'package:benek/common/utils/show_md_modal_sheet.dart';
import 'package:benek/common/widgets/login_screen_widgets/tc_no_popup.dart';
import 'package:benek/presentation/shared/components/choose_location_from_map/choose_location_from_map_screen.dart';
import 'package:benek/store/app_redux_store.dart';
import 'package:benek/store/app_state.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:benek/common/widgets/benek_small_button.dart';
import 'package:benek/common/widgets/benek_textfield.dart';
import 'package:benek/common/widgets/login_screen_widgets/gender_selector_widget.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

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
  String _lat = "";
  String _lng = "";
  String _city= "";
  String _country = "TUR";

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
                        onChanged: (value){
                          setState(() {
                            _fullname = value;
                            _isimler = _fullname.split(" ");
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
                                                  showMarkdownModalSheet(context, 'assets/sozlesmeler/benek_hizmet_sozlesmesi.md');
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
                                                  showMarkdownModalSheet(context, 'assets/sozlesmeler/kisisel_verilerin_korunmasi_acik_riza_beyani.md');
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
                                                  showMarkdownModalSheet(context, 'assets/sozlesmeler/kisisel_verilerin_korunmasi_kullanici_aydinlatma_metni.md');
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
                                                  showMarkdownModalSheet(context, 'assets/sozlesmeler/kisisel_verilerin_korunmasi_ve_gizlilik_politikasi.md');
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
                          BenekSmallButton(
                            iconData: Icons.arrow_forward_ios,
                            isLight: true,
                            isPassive: !(
                              _username.isNotEmpty
                              && _email.contains("@") 
                              && _email.contains(".com") 
                              && _email.isNotEmpty 
                              && _isimler != null
                              && _isimler!.isNotEmpty
                              && _isimler!.length > 1
                              && _password.isNotEmpty
                              && _isConsentGiven
                            ),
                            onTap: () async {
                              String clientId = await getClientId();

                              String? firstname = _isimler![0];
                              String? middlename = _isimler!.length > 2 ? _isimler![1] : null;
                              String? lastname = _isimler!.length > 2 ? _isimler![2] : _isimler![1];

                              Store<AppState> store = AppReduxStore.currentStore!;
                              await LocationHelper.getCurrentLocation(store);

                              final currentLoc = store.state.currentLocation;

                              if (currentLoc != null) {
                                final lat = currentLoc.latitude;
                                final lng = currentLoc.longitude;

                                final isInsideTurkey = lat >= 36.0 && lat <= 42.0 && lng >= 26.0 && lng <= 45.0;

                                if (!isInsideTurkey) {
                                  BenekToastHelper.showErrorToast(
                                    BenekStringHelpers.locale('operationFailed'),
                                    "Türkiyenin dışındasınız, üye olabilmek için Türkiye'de olmalısınız.",
                                    context,
                                  );

                                  return;
                                }
                              }

                              final adress = await Navigator.push(
                                context,
                                PageRouteBuilder(
                                  opaque: false,
                                  barrierDismissible: false,
                                  pageBuilder: (context, _, __) => const ChooseLocationFromMapScreen(),
                                ),
                              );

                              if (adress != null && adress is Map<String, dynamic>) {
                                print("Adres seçildi: $adress");

                                // final tc = await showTcKimlikPopup(context);
                                // if (tc != null) {
                                //   print("Girilen TC: $tc");
                                //   // 🔐 Burada server'a gönderilebilir vs.
                                // } else {
                                //   BenekToastHelper.showErrorToast(
                                //     "İptal Edildi", "TC Kimlik numarası girilmeden işlem devam edemez.", context,
                                //   );
                                //   return;
                                // }
                              }

                              print( "clientId: $clientId, username: $_username, email: $_email, firstname: $firstname, middlename: $middlename, lastname: $lastname, password: $_password, isConsentGiven: $_isConsentGiven");
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
