import 'dart:developer';
import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import '../../presentation/shared/components/loading_components/benek_blured_modal_barier.dart';
import 'package:slide_to_act/slide_to_act.dart';

class ApproveScreen extends StatefulWidget {
  final String title;

  const ApproveScreen({
    super.key,
    required this.title,
  });

  @override
  State<ApproveScreen> createState() => _ApproveScreenState();
}

class _ApproveScreenState extends State<ApproveScreen> {
  bool didApprove = false;
  late FocusNode _focusNode;

  @override
  void initState() {
    super.initState();
    _focusNode = FocusNode();
    _focusNode.requestFocus();
  }

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return KeyboardListener(
      focusNode: _focusNode,
      onKeyEvent: (KeyEvent event) {
        if (event is KeyDownEvent && event.logicalKey == LogicalKeyboardKey.escape) {
          Navigator.of(context).pop(didApprove);
        }
      },
      child: BenekBluredModalBarier(
        isDismissible: true,
        onDismiss: () async {
          Navigator.of(context).pop(didApprove);
        },
        child: Scaffold(
          backgroundColor: Colors.transparent,
          body: Center(
            child: SizedBox(
              width: 500,
              child: Builder(builder: (context) {
                final GlobalKey<SlideActionState> _sliderKey = GlobalKey();
                return SlideAction(
                  key: _sliderKey,
                  text: widget.title,
                  textColor: AppColors.benekBlack,
                  borderRadius: 6.0,
                  textStyle: regularTextStyle(
                      textColor: AppColors.benekBlack, textFontSize: 15.0,
                  ),
                  onSubmit: () {
                    setState(() {
                      didApprove = true;
                    });
                    Navigator.of(context).pop(didApprove);
                    return;
                  },
                  innerColor: AppColors.benekBlack,
                  outerColor: AppColors.benekLightBlue,
                );
              }),
            ),
          ),
        ),
      ),
    );
  }
}
