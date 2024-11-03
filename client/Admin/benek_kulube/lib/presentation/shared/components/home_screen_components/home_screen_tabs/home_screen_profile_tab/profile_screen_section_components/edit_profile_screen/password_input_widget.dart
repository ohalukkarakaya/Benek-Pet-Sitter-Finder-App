import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../benek_process_indicator/benek_process_indicator.dart';

class PasswordInputWidget extends StatefulWidget {
  const PasswordInputWidget({super.key});

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
                    }
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