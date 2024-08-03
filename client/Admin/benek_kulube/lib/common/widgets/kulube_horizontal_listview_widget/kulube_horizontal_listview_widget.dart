import 'dart:developer';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

import '../../../presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/story_components/add_story_button.dart';
import '../../constants/app_colors.dart';
import '../../constants/benek_icons.dart';
import '../../utils/styles.text.dart';

class KulubeHorizontalListViewWidget extends StatefulWidget {

  final bool isEmpty;
  final bool isUsersProfile;
  final bool shouldShowShimmer;
  final String emptyListMessage;
  final Widget? child;
  final Function()? createStoryPageBuilderFunction;

  const KulubeHorizontalListViewWidget({
    super.key,
    required this.isEmpty,
    this.isUsersProfile = false,
    this.shouldShowShimmer = false,
    required this.emptyListMessage,
    this.child,
    this.createStoryPageBuilderFunction,
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
        fontFamily: defaultFontFamily(),
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
                  style: thinTextStyle(
                    textColor: AppColors.benekWhite,
                    textFontSize: 15,
                  ),
                )
            )
            : widget.isEmpty
              && widget.isUsersProfile
               ? Center(
                 child: AddStoryButton(
                      createStoryPageBuilderFunction: widget.createStoryPageBuilderFunction??(){},
                 ),
               )
               : widget.child ?? const SizedBox(),
      ),
    );
  }
}
