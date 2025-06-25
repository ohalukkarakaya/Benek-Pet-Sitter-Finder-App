import 'package:benek/presentation/shared/components/benek_process_indicator/benek_process_indicator.dart';
import 'package:benek/presentation/shared/components/loading_components/benek_blured_modal_barier.dart';
import 'package:flutter/material.dart';
import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/utils/benek_string_helpers.dart';

class EditTextScreen extends StatefulWidget {
  final String? textToEdit;
  final Future<void> Function(String)? onDispatch;
  final String? hintText;
  final int maxCharacter;

  const EditTextScreen({
    super.key,
    this.textToEdit,
    this.onDispatch,
    this.hintText,
    this.maxCharacter = 200,
  });

  @override
  State<EditTextScreen> createState() => _EditTextScreenState();
}

class _EditTextScreenState extends State<EditTextScreen> {
  late final FocusNode _textFocusNode;
  late final TextEditingController _controller;

  bool isFocused = false;
  bool isSendingRequest = false;

  @override
  void initState() {
    super.initState();
    _textFocusNode = FocusNode();
    _controller = TextEditingController(text: widget.textToEdit ?? '');

    _textFocusNode.addListener(() {
      setState(() => isFocused = _textFocusNode.hasFocus);
    });

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        FocusScope.of(context).requestFocus(_textFocusNode);
      }
    });
  }

  @override
  void dispose() {
    _textFocusNode.dispose();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    double maxWidth = MediaQuery.of(context).size.width * 0.9;

    return BenekBluredModalBarier(
      isDismissible: true,
      onDismiss: () => Navigator.of(context).pop(),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Center(
          child: Container(
            width: maxWidth,
            constraints: const BoxConstraints(
              maxHeight: 220,
              minHeight: 160,
            ),
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              color: isFocused ? AppColors.benekLightBlue : AppColors.benekBlack,
              borderRadius: BorderRadius.circular(6.0),
            ),
            child: Column(
              children: [
                Expanded(
                  child: TextFormField(
                    focusNode: _textFocusNode,
                    controller: _controller,
                    maxLength: widget.maxCharacter,
                    maxLines: 4,
                    minLines: 1,
                    keyboardType: TextInputType.multiline,
                    cursorColor: isFocused ? AppColors.benekBlack : AppColors.benekWhite,
                    style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                      color: isFocused ? AppColors.benekBlack : AppColors.benekWhite,
                      fontSize: 14,
                      height: 1.4,
                      letterSpacing: 0.3,
                    ),
                    decoration: InputDecoration(
                      hintText: widget.hintText ?? BenekStringHelpers.locale('writeBio'),
                      hintStyle: Theme.of(context).textTheme.bodyMedium!.copyWith(
                        color: AppColors.benekGrey,
                        fontSize: 14,
                        height: 1.4,
                        letterSpacing: 0.3,
                      ),
                      border: InputBorder.none,
                      counterText: '',
                      contentPadding: EdgeInsets.zero,
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                Align(
                  alignment: Alignment.bottomRight,
                  child: IconButton(
                    padding: EdgeInsets.zero,
                    onPressed: () async {
                      if (widget.onDispatch != null && !isSendingRequest) {
                        setState(() => isSendingRequest = true);
                        await widget.onDispatch!(_controller.text);
                        setState(() => isSendingRequest = false);
                        Navigator.of(context).pop(_controller.text);
                      } else {
                        Navigator.of(context).pop(_controller.text);
                      }
                    },
                    icon: isSendingRequest
                        ? BenekProcessIndicator(
                            color: isFocused ? AppColors.benekBlack : AppColors.benekWhite,
                            width: 16.0,
                            height: 16.0,
                          )
                        : Icon(
                            Icons.send,
                            color: isFocused ? AppColors.benekBlack : AppColors.benekWhite,
                            size: 18.0,
                          ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
