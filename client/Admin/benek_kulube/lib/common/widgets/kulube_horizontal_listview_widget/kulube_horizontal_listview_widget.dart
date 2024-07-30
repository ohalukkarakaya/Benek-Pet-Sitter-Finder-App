import 'dart:developer';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

import '../../../presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/story_components/add_story_button.dart';
import '../../constants/app_colors.dart';
import '../../constants/benek_icons.dart';

class KulubeHorizontalListViewWidget extends StatefulWidget {
  final bool isEmpty;
  final bool isUsersProfile;
  final bool shouldShowShimmer;
  final String emptyListMessage;
  final Widget? child;
  const KulubeHorizontalListViewWidget({
    super.key,
    required this.isEmpty,
    this.isUsersProfile = false,
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
          && !widget.isUsersProfile
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
            : widget.isUsersProfile
               ? const AddStoryButton()
               : widget.child ?? const SizedBox(),
      ),
    );
  }
}
