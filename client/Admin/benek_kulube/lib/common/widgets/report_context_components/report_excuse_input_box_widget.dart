import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:flutter/material.dart';
import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:benek_kulube/presentation/shared/components/benek_process_indicator/benek_process_indicator.dart';

class ExcuseInputBoxWidget extends StatefulWidget {
  final String? initialText;
  final Future<void> Function(String)? onSend;
  final VoidCallback? onCancel;
  final String? hintText;
  final int maxCharacter;

  const ExcuseInputBoxWidget({
    super.key,
    this.initialText,
    this.onSend,
    this.onCancel,
    this.hintText,
    this.maxCharacter = 200,
  });

  @override
  State<ExcuseInputBoxWidget> createState() => _ExcuseInputBoxWidgetState();
}

class _ExcuseInputBoxWidgetState extends State<ExcuseInputBoxWidget> {
  late TextEditingController _controller;
  late FocusNode _focusNode;
  bool isFocused = false;
  bool isSending = false;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialText ?? '');
    _controller.addListener(() => setState(() {}));
    _focusNode = FocusNode()
      ..addListener(() {
        setState(() {
          isFocused = _focusNode.hasFocus;
        });
      });
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isTextNotEmpty = _controller.text.trim().isNotEmpty;

    return Container(
      constraints: const BoxConstraints(
        minHeight: 150,
        maxHeight: 250,
      ),
      decoration: BoxDecoration(
        color: isFocused ? AppColors.benekLightBlue : AppColors.benekBlack,
        borderRadius: BorderRadius.circular(6.0),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
      child: Column(
        children: [
          Expanded(
            child: ScrollConfiguration(
              behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
              child: SingleChildScrollView(
                child: TextFormField(
                  focusNode: _focusNode,
                  controller: _controller,
                  maxLength: widget.maxCharacter,
                  maxLines: null,
                  keyboardType: TextInputType.multiline,
                  onChanged: (value) {
                    setState(() {});
                  },
                  style: lightTextStyle(
                    textColor: isFocused ? AppColors.benekBlack : AppColors.benekWhite,
                  ),
                  cursorColor: isFocused ? AppColors.benekBlack : AppColors.benekWhite,
                  decoration: InputDecoration(
                    hintText: widget.hintText ?? BenekStringHelpers.locale('enterExcuse'),
                    hintStyle: lightTextStyle(textColor: AppColors.benekGrey),
                    border: InputBorder.none,
                    counterText: '',
                    contentPadding: EdgeInsets.zero,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 12.0),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // ❌ Cancel button (hover efektli)
              MouseRegion(
                cursor: SystemMouseCursors.click,
                child: GestureDetector(
                  onTap: widget.onCancel,
                  child: Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: Colors.red,
                      borderRadius: BorderRadius.circular(4.0),
                    ),
                    child: const Icon(
                      Icons.close,
                      color: Colors.white,
                      size: 18,
                    ),
                  ),
                ),
              ),

              // ✅ Send button (kutusuz IconButton)
              IconButton(
                padding: EdgeInsets.zero,
                onPressed: isTextNotEmpty && !isSending && widget.onSend != null
                    ? () async {
                      setState(() => isSending = true);
                      await widget.onSend!(_controller.text.trim());
                      setState(() => isSending = false);
                    }
                    : null,
                icon: isSending
                    ? BenekProcessIndicator(
                      color: isFocused ? AppColors.benekBlack : AppColors.benekWhite,
                      width: 16,
                      height: 16,
                    )
                    : Icon(
                      Icons.send,
                      size: 20,
                      color: isTextNotEmpty
                          ? (isFocused ? AppColors.benekBlack : AppColors.benekWhite)
                          : Colors.grey.shade500,
                    ),
                tooltip: BenekStringHelpers.locale('sendExcuse'),
                splashRadius: 20,
                mouseCursor: isTextNotEmpty ? SystemMouseCursors.click : SystemMouseCursors.basic,
              ),
            ],
          )
        ],
      ),
    );
  }
}
