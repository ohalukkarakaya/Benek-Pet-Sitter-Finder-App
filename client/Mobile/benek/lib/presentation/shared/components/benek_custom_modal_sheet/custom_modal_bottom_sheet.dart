import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:benek/common/constants/app_colors.dart';

void showCustomBlurBottomSheet(
  BuildContext context,
  bool isDismissible,
  Widget child,
) {
  showGeneralDialog(
    context: context,
    barrierDismissible: isDismissible,
    barrierLabel: "Dismiss",
    barrierColor: Colors.transparent,
    transitionDuration: const Duration(milliseconds: 300),
    pageBuilder: (_, __, ___) => const SizedBox(),
    transitionBuilder: (context, anim1, anim2, _) {
      return _BlurDialogContent(
        isDismissible: isDismissible,
        child: child,
      );
    },
  );
}

class _BlurDialogContent extends StatefulWidget {
  final bool isDismissible;
  final Widget child;

  const _BlurDialogContent({
    required this.isDismissible,
    required this.child,
  });

  @override
  State<_BlurDialogContent> createState() => _BlurDialogContentState();
}

class _BlurDialogContentState extends State<_BlurDialogContent>
    with WidgetsBindingObserver {
  double bottomInset = 0.0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // MediaQuery burada güvenli
    bottomInset = MediaQuery.of(context).viewInsets.bottom;
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeMetrics() {

    if (mounted) {
      setState(() {
        bottomInset = EdgeInsets.fromViewPadding(
          View.of(context).viewInsets,
          View.of(context).devicePixelRatio,
        ).bottom;

      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.isDismissible ? () => Navigator.of(context).pop() : null,
      child: Stack(
        children: [
          BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: Container(color: Colors.black.withAlpha(128)),
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: AnimatedPadding(
              duration: const Duration(milliseconds: 200),
              padding: EdgeInsets.only(bottom: bottomInset),
              child: Material(
                color: Colors.transparent,
                child: Container(
                  width: double.infinity,
                  decoration: const BoxDecoration(
                    color: AppColors.benekBlack,
                    borderRadius: BorderRadius.vertical(
                      top: Radius.circular(20),
                    ),
                  ),
                  padding: const EdgeInsets.all(24.0),
                  child: widget.child,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
