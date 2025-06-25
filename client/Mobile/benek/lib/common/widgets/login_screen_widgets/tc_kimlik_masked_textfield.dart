import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/utils/styles.text.dart';

class TcKimlikMaskedTextField extends StatefulWidget {
  final void Function(String tcNo) onSubmitted;
  final String? message;

  const TcKimlikMaskedTextField({
    super.key,
    required this.onSubmitted,
    this.message,
  });

  @override
  State<TcKimlikMaskedTextField> createState() => _TcKimlikMaskedTextFieldState();
}

class _TcKimlikMaskedTextFieldState extends State<TcKimlikMaskedTextField> {
  final TextEditingController _controller = TextEditingController();
  late FocusNode _focusNode;

  String get _maskedValue {
    final input = _controller.text;
    if (input.length <= 3) return input;
    if (input.length <= 6) {
      return input.substring(0, 3) + '•' * (input.length - 3);
    }
    if (input.length <= 11) {
      final start = input.substring(0, 3);
      final end = input.substring(input.length - 3);
      final dots = '•' * (input.length - 6);
      return '$start$dots$end';
    }
    return input;
  }

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
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        /// 🔹 Blur efekti
        BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Container(
            color: AppColors.benekBlack.withOpacity(0.3),
          ),
        ),

        /// 🔹 İçerik
        Center(
          child: Stack(
            children: [
              // 🔹 Görünmez TextField
              Positioned.fill(
                child: Opacity(
                  opacity: 0.0,
                  child: TextField(
                    controller: _controller,
                    focusNode: _focusNode,
                    keyboardType: TextInputType.number,
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(11),
                    ],
                    onChanged: (_) => setState(() {}),
                    onSubmitted: (val) {
                      if (val.length == 11) {
                        widget.onSubmitted(val);
                      }
                    },
                  ),
                ),
              ),

              // 🔹 Maskeli Görünüm
              GestureDetector(
                onTap: () => _focusNode.requestFocus(),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (widget.message != null) ...[
                      Text(
                        widget.message!,
                        style: mediumTextStyle(
                          textColor: AppColors.benekGrey,
                          textFontSize: 10,
                        ),
                      ),
                      const SizedBox(height: 8.0),
                    ],
                    Text(
                      _maskedValue,
                      style: boldTextStyle(
                        textFontSize: 22,
                        textColor: AppColors.benekWhite,
                      ),
                    ),
                    const SizedBox(height: 16.0),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.benekLightBlue,
                      ),
                      onPressed: _controller.text.length == 11
                          ? () => widget.onSubmitted(_controller.text)
                          : null,
                      child: const Text("Devam"),
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