import 'dart:developer';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

import '../../constants/app_colors.dart';

class KulubeHorizontalListViewWidget extends StatefulWidget {
  final bool isEmpty;
  final bool shouldShowShimmer;
  final String emptyListMessage;
  final Widget? child;
  const KulubeHorizontalListViewWidget({
    super.key,
    required this.isEmpty,
    this.shouldShowShimmer = false,
    required this.emptyListMessage,
    this.child
  });

  @override
  State<KulubeHorizontalListViewWidget> createState() => _KulubeHorizontalListViewWidgetState();
}

class _KulubeHorizontalListViewWidgetState extends State<KulubeHorizontalListViewWidget> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      scrollBehavior: const MaterialScrollBehavior().copyWith(
        dragDevices: {PointerDeviceKind.mouse},
      ),
      debugShowCheckedModeBanner: false,
      color: Colors.transparent,
      theme: ThemeData(
        splashFactory: InkRipple.splashFactory,
        fontFamily: 'Qanelas',
      ),
      darkTheme: ThemeData.dark().copyWith(
        splashFactory: InkRipple.splashFactory,
      ),
      themeMode: ThemeMode.dark,
      home: Scaffold(
        backgroundColor: Colors.transparent,
        body: widget.shouldShowShimmer
        ?  Shimmer.fromColors(
            baseColor: AppColors.benekBlack.withOpacity(0.4),
            highlightColor: AppColors.benekBlack.withOpacity(0.2),
            enabled: widget.shouldShowShimmer,
            child: widget.child ?? const SizedBox(),
        )
        : widget.isEmpty
            ? Center(
                child: Text(
                  widget.emptyListMessage,
                  style: const TextStyle(
                    color: AppColors.benekWhite,
                    fontSize: 15,
                    fontWeight: FontWeight.w200,
                    fontFamily: 'Qanelas',
                  ),
                )
            )
            : widget.child ?? const SizedBox(),
      ),
    );
  }
}
