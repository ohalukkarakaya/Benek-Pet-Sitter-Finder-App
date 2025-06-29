import 'package:benek/presentation/shared/components/home_screen_components/home_screen_profile_tab/profile_screen_section_components/story_components/add_story_button.dart';
import 'package:flutter/material.dart';
import '../../constants/app_colors.dart';
import '../../utils/styles.text.dart';

class KulubeHorizontalListViewWidget extends StatelessWidget {
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
  Widget build(BuildContext context) {
    if (shouldShowShimmer) {
      return child ?? const SizedBox();
    }

    if (isEmpty && !isUsersProfile) {
      return Center(
        child: Text(
          emptyListMessage,
          style: thinTextStyle(
            textColor: AppColors.benekWhite,
            textFontSize: 15,
          ),
        ),
      );
    }

    if (isEmpty && isUsersProfile) {
      return Center(
        child: AddStoryButton(
          createStoryPageBuilderFunction: createStoryPageBuilderFunction ?? () {},
        ),
      );
    }

    return child ?? const SizedBox();
  }
}