import 'dart:developer';

import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/utils/benek_toast_helper.dart';
import '../../../../../../../../common/utils/styles.text.dart';
import '../../../../../../../../data/services/custom_exception.dart';
import '../../../../../benek_process_indicator/benek_process_indicator.dart';
import '../../../../../loading_components/benek_blured_modal_barier.dart';

class PasswordTextfield extends StatefulWidget {
  final String verifyingString;
  final Future<void> Function(String) onDispatch;
  final int passwordCharacterCount;

  const PasswordTextfield({
    super.key,
    required this.verifyingString,
    required this.onDispatch,
    this.passwordCharacterCount = 6,
  });

  @override
  State<PasswordTextfield> createState() => _PasswordTextfieldState();
}

class _PasswordTextfieldState extends State<PasswordTextfield> {
  final TextEditingController _controller = TextEditingController();
  late FocusNode _focusNode;

  bool isSendingRequest = false;

  @override
  void initState() {
    super.initState();
    _focusNode = FocusNode();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }

  KeyEventResult _handleKeyPress(FocusNode node, KeyEvent event) {
    if (event is KeyDownEvent) {
      if (event.logicalKey == LogicalKeyboardKey.backspace) {
        // Backspace key
        if (_controller.text.isNotEmpty) {
          setState(() {
            _controller.text = _controller.text.substring(0, _controller.text.length - 1);
            _controller.selection = TextSelection.fromPosition(
              TextPosition(offset: _controller.text.length),
            );
          });
        }
        return KeyEventResult.handled;
      } else if (
      event.logicalKey.keyLabel.length == 1 &&
          '0'.compareTo(event.logicalKey.keyLabel) <= 0 &&
          '9'.compareTo(event.logicalKey.keyLabel) >= 0
      ) {
        // Numeric keys 0-9
        if (_controller.text.length < widget.passwordCharacterCount) {
          setState(() {
            _controller.text += event.logicalKey.keyLabel;
            _controller.selection = TextSelection.fromPosition(
              TextPosition(offset: _controller.text.length),
            );
          });
        }
        return KeyEventResult.handled;
      }
    }
    return KeyEventResult.ignored;
  }

  @override
  Widget build(BuildContext context) {
    return BenekBluredModalBarier(
      isDismissible: false,
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Focus(
          focusNode: _focusNode,
          onKeyEvent: _handleKeyPress,
          child: Center(
            child: Container(
              width: 400,
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                color: AppColors.benekLightBlue,
                borderRadius: BorderRadius.circular(6.0),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 15.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: List.generate(
                        widget.passwordCharacterCount,
                            (index) {
                          bool isFilled = _controller.text.length > index;
                          return Padding(
                            padding: const EdgeInsets.only(right: 25.0),
                            child: Icon(
                              FontAwesomeIcons.asterisk,
                              color: isFilled ? AppColors.benekBlack : AppColors.benekGrey,
                              size: 20,
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                  const SizedBox(height: 10.0),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      MouseRegion(
                        cursor: SystemMouseCursors.click,
                        child: GestureDetector(
                          onTap: (){
                            Navigator.of(context).pop('reSend');
                          },
                          child: Text(
                            BenekStringHelpers.locale('reSendEmail'),
                            style: regularTextStyle(textColor: AppColors.benekAirForceBlue).copyWith(
                              decoration: TextDecoration.underline,
                            ),
                          ),
                        ),
                      ),
                      IconButton(
                        padding: EdgeInsets.zero,
                        onPressed: () async {
                          if (_controller.text.length != widget.passwordCharacterCount) {
                            BenekToastHelper.showErrorToast(
                              BenekStringHelpers.locale('error'),
                              BenekStringHelpers.locale('missingOtpCode'),
                              context,
                            );
                            return;
                          }

                          if (!isSendingRequest) {
                            setState(() {
                              isSendingRequest = true;
                            });
                            try {
                              await widget.onDispatch(_controller.text);
                              setState(() {
                                isSendingRequest = false;
                              });
                            } on CustomException catch (e) {
                              BenekToastHelper.showErrorToast(
                                BenekStringHelpers.locale('error'),
                                e.message,
                                context,
                              );
                              return;
                            }
                            Navigator.of(context).pop(widget.verifyingString);
                          }
                        },
                        icon: !isSendingRequest
                            ? const Icon(
                          Icons.send,
                          color: AppColors.benekBlack,
                          size: 15,
                        )
                            : const BenekProcessIndicator(
                          color: AppColors.benekBlack,
                          width: 15.0,
                          height: 15.0,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
