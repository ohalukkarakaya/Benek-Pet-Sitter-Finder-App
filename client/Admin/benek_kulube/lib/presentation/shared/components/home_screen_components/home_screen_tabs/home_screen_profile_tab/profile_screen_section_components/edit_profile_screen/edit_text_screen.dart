import 'package:benek_kulube/presentation/shared/components/loading_components/benek_blured_modal_barier.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/utils/benek_string_helpers.dart';
import '../../../../../../../../common/utils/styles.text.dart';
import '../../../../../benek_process_indicator/benek_process_indicator.dart';

class EditTextScreen extends StatefulWidget {
  final String textToEdit;
  final Future<void> Function(String) onDispatch;

  const EditTextScreen({
    super.key,
    required this.textToEdit,
    required this.onDispatch,
  });

  @override
  State<EditTextScreen> createState() => _EditTextScreenState();
}

class _EditTextScreenState extends State<EditTextScreen> {
  late FocusNode _focusNodeEditProfileText;
  late final FocusScopeNode _focusScopeNodeEditProfileTex;
  late final FocusNode _textFocusNodeEditProfileTex;
  late final TextEditingController _textControllerEditProfileTex;

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
    _focusNodeEditProfileText = FocusNode();
    _focusScopeNodeEditProfileTex = FocusScopeNode();
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
    _focusNodeEditProfileText.dispose();
    _focusScopeNodeEditProfileTex.dispose();
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
            width: 500,
            height: 148,
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              color: isFocused ? AppColors.benekLightBlue : AppColors.benekBlack,
              borderRadius: BorderRadius.circular(6.0),
            ),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 0.0),
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          SizedBox(
                            height: 50.0,
                            child: ScrollConfiguration(
                              behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
                              child: SingleChildScrollView(
                                physics: const BouncingScrollPhysics(),
                                child: FocusScope(
                                  node: _focusScopeNodeEditProfileTex,
                                  child: TextFormField(
                                    focusNode: _textFocusNodeEditProfileTex,
                                    controller: _textControllerEditProfileTex,
                                    maxLength: 200,
                                    onChanged: (value) {
                                      setState(() {});
                                    },
                                    maxLines: null,
                                    keyboardType: TextInputType.multiline,
                                    cursorColor: isFocused ? AppColors.benekBlack : AppColors.benekWhite,
                                    style: lightTextStyle(textColor: isFocused ? AppColors.benekBlack : AppColors.benekWhite),
                                    textAlignVertical: TextAlignVertical.top,
                                    decoration: InputDecoration(
                                      counterText: '',
                                      hintText: BenekStringHelpers.locale('writeBio'),
                                      hintStyle: isFocused ? lightTextStyle(textColor: AppColors.benekGrey) : null,
                                      contentPadding: EdgeInsets.zero,
                                      border: InputBorder.none,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 10.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              IconButton(
                                padding: EdgeInsets.zero,
                                onPressed: () async {
                                  if (!isSendingRequest) {
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
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}