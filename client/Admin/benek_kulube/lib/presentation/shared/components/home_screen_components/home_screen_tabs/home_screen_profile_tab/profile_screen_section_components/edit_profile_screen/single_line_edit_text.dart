import 'package:benek_kulube/common/utils/benek_toast_helper.dart';
import 'package:benek_kulube/presentation/shared/components/loading_components/benek_blured_modal_barier.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../../common/utils/styles.text.dart';
import '../../../../../../../../common/widgets/approve_screen.dart';
import '../../../../../benek_process_indicator/benek_process_indicator.dart';

class SingleLineEditTextScreen extends StatefulWidget {
  final String? info;
  final String textToEdit;
  final Future<void> Function(String) onDispatch;
  final bool Function(String) validation;
  final String? validationErrorMessage;
  final bool shouldApprove;
  final String? approvalTitle;

  const SingleLineEditTextScreen({
    super.key,
    this.info,
    required this.textToEdit,
    required this.onDispatch,
    this.validation = defaultValidation,
    this.validationErrorMessage,
    this.shouldApprove = false,
    this.approvalTitle,
  });

  static bool defaultValidation(String input) {
    return true;
  }


  @override
  State<SingleLineEditTextScreen> createState() => _SingleLineEditTextScreenState();
}

class _SingleLineEditTextScreenState extends State<SingleLineEditTextScreen> {
  late FocusNode _textFocusNodeEditProfileTex;
  late TextEditingController _textControllerEditProfileTex;

  bool isFocused = false;
  bool isSendingRequest = false;

  void _onFocusChanged() {
    setState(() {
      isFocused = _textFocusNodeEditProfileTex.hasFocus;
    });
  }

  @override
  void initState() {
    super.initState();
    _textFocusNodeEditProfileTex = FocusNode();
    _textControllerEditProfileTex = TextEditingController();

    _textFocusNodeEditProfileTex.addListener(_onFocusChanged);
    _textControllerEditProfileTex.text = widget.textToEdit;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      FocusScope.of(context).requestFocus(_textFocusNodeEditProfileTex);
    });
  }

  @override
  void dispose() {
    _textFocusNodeEditProfileTex.dispose();
    _textControllerEditProfileTex.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BenekBluredModalBarier(
      isDismissible: true,
      onDismiss: () {
        Navigator.of(context).pop();
      },
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Center(
          child: Container(
            width: 400,
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              color: isFocused ? AppColors.benekLightBlue : AppColors.benekBlack,
              borderRadius: BorderRadius.circular(6.0),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                TextFormField(
                  focusNode: _textFocusNodeEditProfileTex,
                  controller: _textControllerEditProfileTex,
                  maxLength: 50, // Max karakter sayısı
                  maxLines: 1, // Tek satır
                  textInputAction: TextInputAction.done,
                  cursorColor: isFocused ? AppColors.benekBlack : AppColors.benekWhite,
                  style: lightTextStyle(textColor: isFocused ? AppColors.benekBlack : AppColors.benekWhite),
                  decoration: InputDecoration(
                    counterText: '', // Karakter sayısı göstergesini gizler
                    hintText: BenekStringHelpers.locale('writeBio'),
                    hintStyle: lightTextStyle(textColor: AppColors.benekGrey),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: 8.0),
                  ),
                  onFieldSubmitted: (value) async {
                    if(!widget.validation(_textControllerEditProfileTex.text)) {
                      BenekToastHelper.showErrorToast(
                          BenekStringHelpers.locale('error'),
                          widget.validationErrorMessage ?? BenekStringHelpers.locale('error'),
                          context
                      );
                      return;
                    }

                    if (!isSendingRequest) {

                      if(widget.shouldApprove){
                        bool didApprove = await Navigator.push(
                          context,
                          PageRouteBuilder(
                            opaque: false,
                            barrierDismissible: false,
                            pageBuilder: (context, _, __) => ApproveScreen(title: widget.approvalTitle ?? BenekStringHelpers.locale('slideToApprove')),
                          ),
                        );

                        if(didApprove != true) return;
                      }

                      setState(() {
                        isSendingRequest = true;
                      });
                      await widget.onDispatch(_textControllerEditProfileTex.text);
                      setState(() {
                        isSendingRequest = false;
                      });
                      Navigator.of(context).pop(_textControllerEditProfileTex.text);
                    }
                  },
                ),
                const SizedBox(height: 10.0),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    widget.info != null
                        ? Text(
                            widget.info!,
                            style: regularTextStyle(
                              textColor: isFocused ?
                                  AppColors.benekAirForceBlue :
                                  AppColors.benekLightBlue,
                            ),
                          )
                        : const SizedBox(),

                    IconButton(
                      padding: EdgeInsets.zero,
                      onPressed: () async {

                        if(!widget.validation(_textControllerEditProfileTex.text)) {
                          BenekToastHelper.showErrorToast(
                              BenekStringHelpers.locale('error'),
                              widget.validationErrorMessage ?? BenekStringHelpers.locale('error'),
                              context
                          );
                          return;
                        }

                        if (!isSendingRequest) {

                          if(widget.shouldApprove){
                            bool didApprove = await Navigator.push(
                              context,
                              PageRouteBuilder(
                                opaque: false,
                                barrierDismissible: false,
                                pageBuilder: (context, _, __) => ApproveScreen(title: widget.approvalTitle ?? BenekStringHelpers.locale('slideToApprove')),
                              ),
                            );

                            if(didApprove != true) return;
                          }

                          setState(() {
                            isSendingRequest = true;
                          });
                          await widget.onDispatch(_textControllerEditProfileTex.text);
                          setState(() {
                            isSendingRequest = false;
                          });
                          Navigator.of(context).pop(_textControllerEditProfileTex.text);
                        }
                      },
                      icon: !isSendingRequest
                          ? Icon(
                            Icons.send,
                            color: isFocused ? AppColors.benekBlack : AppColors.benekWhite,
                            size: 15,
                          )
                          : BenekProcessIndicator(
                            color: isFocused ? AppColors.benekBlack : AppColors.benekWhite,
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
    );
  }
}