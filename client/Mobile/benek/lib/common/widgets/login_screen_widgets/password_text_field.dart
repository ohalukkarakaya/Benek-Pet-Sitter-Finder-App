import 'dart:ui';

import 'package:benek/data/services/api.dart';
import 'package:benek/presentation/shared/components/benek_process_indicator/benek_process_indicator.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../../common/utils/benek_toast_helper.dart';
import '../../../../../../../../common/utils/styles.text.dart';
import '../../../../../../../../data/services/custom_exception.dart';

class PasswordTextfield extends StatefulWidget {
  final String? message;
  final String verifyingString;
  final Future<void> Function(String) onDispatch;
  final int passwordCharacterCount;
  final bool isResendButtonActive;

  const PasswordTextfield({
    super.key,
    this.message,
    required this.verifyingString,
    required this.onDispatch,
    this.passwordCharacterCount = 6,
    this.isResendButtonActive = true,
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

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // 🔽 BLUR EFEKTİ BURADA
        BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Container(
            color: AppColors.benekBlack.withAlpha((0.3 * 255).round()),
          ),
        ),

        // İçerik
        Center(
          child: Stack(
            children: [
              // Görünmez ama aktif TextField
              Positioned.fill(
                child: Opacity(
                  opacity: 0.0,
                  child: TextField(
                    controller: _controller,
                    focusNode: _focusNode,
                    autofocus: true,
                    keyboardType: TextInputType.number,
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(
                          widget.passwordCharacterCount),
                    ],
                    onChanged: (_) => setState(() {}),
                  ),
                ),
              ),
              // Gerçek UI
              Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    widget.message != null
                    ? Text(
                      widget.message!,
                      style: mediumTextStyle(
                        textColor: AppColors.benekGrey,
                        textFontSize: 10,
                      ),
                    )
                    : const SizedBox(),
                    SizedBox(
                      height: widget.message != null ? 10.0 : 0.0,
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 15.0),
                      child: GestureDetector(
                        onTap: () => _focusNode.requestFocus(),
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
                                  color: isFilled
                                      ? AppColors.benekLightBlue
                                      : AppColors.benekGrey,
                                  size: 20,
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 10.0),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        widget.isResendButtonActive
                            ? GestureDetector(
                                onTap: () async {
                                  await UserInfoApi().postResendEmailOtp(
                                      widget.verifyingString);
                                  BenekToastHelper.showSuccessToast(
                                      BenekStringHelpers.locale(
                                          'operationSucceeded'),
                                      "Eposta yeniden gönderildi",
                                      context);
                                },
                                child: Text(
                                  BenekStringHelpers.locale('reSendEmail'),
                                  style: regularTextStyle(
                                    textColor: AppColors.benekLightBlue,
                                  ).copyWith(
                                    decoration: TextDecoration.underline,
                                  ),
                                ),
                              )
                            : const SizedBox(),
                        IconButton(
                          padding: EdgeInsets.zero,
                          onPressed: () async {
                            if (_controller.text.length !=
                                widget.passwordCharacterCount) {
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
                              } on CustomException catch (e) {
                                setState(() {
                                  isSendingRequest = false;
                                });
                                BenekToastHelper.showErrorToast(
                                  BenekStringHelpers.locale('error'),
                                  e.message,
                                  context,
                                );
                              }
                            }
                          },
                          icon: !isSendingRequest
                              ? const Icon(
                                  Icons.send,
                                  color: AppColors.benekLightBlue,
                                  size: 15,
                                )
                              : const BenekProcessIndicator(
                                  color: AppColors.benekLightBlue,
                                  width: 15.0,
                                  height: 15.0,
                                ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
