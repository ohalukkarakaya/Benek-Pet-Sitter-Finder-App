import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/benek_toast_helper.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/edit_profile_screen/single_line_edit_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../benek_process_indicator/benek_process_indicator.dart';

class PasswordInputWidget extends StatefulWidget {
  final Future<void> Function(String, String) onDispatch;
  const PasswordInputWidget({
    required this.onDispatch,
    super.key
  });

  @override
  _PasswordInputWidgetState createState() => _PasswordInputWidgetState();
}

class _PasswordInputWidgetState extends State<PasswordInputWidget> {
  bool isSendingRequest = false;
  final TextEditingController _controller = TextEditingController();
  final FocusNode _passWordFocusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    _controller.addListener(() {
      setState(() {});
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _passWordFocusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final int maxVisibleCharacters = (MediaQuery.of(context).size.width / 45).floor();
    final int characterCount = _controller.text.length;

    String? oldPassword;

    List<Widget> icons = [];
    if (characterCount <= maxVisibleCharacters) {
      icons = List.generate(characterCount, (index) {
        final bool isLastElement = index == characterCount - 1;
        return Padding(
          padding: EdgeInsets.only(right: !isLastElement ? 15.0 : 0.0),
          child: Icon(
            FontAwesomeIcons.asterisk,
            color: _passWordFocusNode.hasFocus ? AppColors.benekBlack : AppColors.benekLightBlue,
            size: 10,
          ),
        );
      });
    } else {
      icons = List.generate(maxVisibleCharacters, (index) {
        return Padding(
          padding: const EdgeInsets.only(right: 15.0),
          child: Icon(
            FontAwesomeIcons.asterisk,
            color: _passWordFocusNode.hasFocus ? AppColors.benekBlack : AppColors.benekLightBlue,
            size: 10,
          ),
        );
      });
    }

    return GestureDetector(
      onTap: () {
        FocusScope.of(context).requestFocus(_passWordFocusNode);
      },
      child: Container(
        width: 496,
        height: 70,
        padding: const EdgeInsets.symmetric(vertical: 25, horizontal: 20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(6.0),
          color: _passWordFocusNode.hasFocus ? AppColors.benekLightBlue : AppColors.benekBlack,
        ),
        child: Stack(
          children: [
            Opacity(
              opacity: 0.0,
              child: TextField(
                controller: _controller,
                focusNode: _passWordFocusNode,
                obscureText: true,
                obscuringCharacter: '*',
                decoration: const InputDecoration(
                  border: InputBorder.none,
                ),
                style: const TextStyle(
                  color: Colors.transparent,
                ),
                onChanged: (text) {
                  setState(() {});
                },
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: icons.length > 0
                        ? ListView(
                          scrollDirection: Axis.horizontal,
                          physics: const NeverScrollableScrollPhysics(),
                          shrinkWrap: true,
                          children: icons,
                        )
                        : Text(
                          BenekStringHelpers.locale('enterYourCurrentPassword'),
                          style: lightTextStyle(
                            textColor: _passWordFocusNode.hasFocus ? AppColors.benekAirForceBlue : AppColors.benekGrey,
                            textFontSize: 14.0,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 10),
                IconButton(
                  splashColor: Colors.transparent,
                  highlightColor: Colors.transparent,
                  hoverColor: Colors.transparent,
                  onPressed: () async {
                    if (_controller.text.length != characterCount) {
                      // Show error toast or handle invalid input
                      BenekToastHelper.showErrorToast("Invalid Input", "Hatalı Giriş", context);
                      return;
                    }

                    setState(() {
                      oldPassword = _controller.text;
                      _controller.text = "";
                    });

                    await Navigator.push(
                      context,
                      PageRouteBuilder(
                        opaque: false,
                        barrierDismissible: false,
                        pageBuilder: (context, _, __) => SingleLineEditTextScreen(
                          info: BenekStringHelpers.locale('newPassword'),
                          hint: BenekStringHelpers.locale('enterYourNewPassword'),
                          onDispatch: (text) => widget.onDispatch(oldPassword!, text),
                          validation: (text) {
                            // Minimum 8 ve maksimum 30 karakter uzunluğunda
                            final lengthRegex = RegExp(r'^.{8,30}$');
                            // En az bir büyük harf
                            final upperCaseRegex = RegExp(r'[A-Z]');
                            // En az bir küçük harf
                            final lowerCaseRegex = RegExp(r'[a-z]');
                            // En az bir rakam
                            final numberRegex = RegExp(r'[0-9]');
                            // En az bir özel karakter
                            final symbolRegex = RegExp(r'[!@#$%^&*(),.?":{}|<>]');

                            // Şifre kurallarını kontrol et
                            if (!lengthRegex.hasMatch(text)) return false;
                            if (!upperCaseRegex.hasMatch(text)) return false;
                            if (!lowerCaseRegex.hasMatch(text)) return false;
                            if (!numberRegex.hasMatch(text)) return false;
                            if (!symbolRegex.hasMatch(text)) return false;

                            // Tüm kurallar geçildi
                            return true;
                          },
                          validationErrorMessage: BenekStringHelpers.locale('passwordValidationError'),
                          shouldApprove: true,
                          shouldHideText: true,
                        ),
                      ),
                    );
                  },
                  icon: !isSendingRequest
                      ? Icon(
                    Icons.send,
                    color: !_passWordFocusNode.hasFocus ? AppColors.benekWhite : AppColors.benekBlack,
                    size: 15,
                  )
                      : BenekProcessIndicator(
                    color: !_passWordFocusNode.hasFocus ? AppColors.benekWhite : AppColors.benekBlack,
                    width: 15.0,
                    height: 15.0,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}