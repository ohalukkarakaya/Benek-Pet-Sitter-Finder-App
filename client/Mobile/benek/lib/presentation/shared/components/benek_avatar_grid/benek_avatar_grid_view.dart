import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:benek/data/models/pet_models/pet_model.dart';
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../common/constants/app_colors.dart';
import 'benek_avatar_grid_view_builder.dart';

class BenekAvatarGridViewWidget extends StatefulWidget {
  final List<dynamic> list;
  final String? emptyMessage;
  final bool shouldEnableShimmer;

  const BenekAvatarGridViewWidget({
    super.key,
    required this.list,
    this.emptyMessage,
    this.shouldEnableShimmer = true,
  });

  @override
  State<BenekAvatarGridViewWidget> createState() => _BenekAvatarGridViewWidgetState();
}

class _BenekAvatarGridViewWidgetState extends State<BenekAvatarGridViewWidget> {
  @override
  Widget build(BuildContext context) {
    int itemCount = widget.list.isNotEmpty ? widget.list.length : 0;
    int gridCount = itemCount > 6 ? 6 : itemCount;

    return itemCount > 0
    ? widget.shouldEnableShimmer || widget.list[0] is! PetModel
      ? Shimmer.fromColors(
          baseColor: AppColors.benekBlack.withAlpha(102),
          highlightColor: AppColors.benekBlack.withAlpha(51),
          enabled: widget.shouldEnableShimmer,
          child: GridView.builder(
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: gridCount < 3 ? gridCount : 3,
                crossAxisSpacing: 10.0,
                mainAxisSpacing: 10.0,
              ),
              itemCount: gridCount < 6 ? gridCount : 6,
              itemBuilder: (BuildContext context, int index) {
                return BenekAvatarGridViewBuilder(
                  index: index,
                  itemCount: itemCount,
                  item: widget.list[index],
                  shouldEnableShimmer: widget.shouldEnableShimmer || widget.list[index] is String,
                );
              }

          ),
        )
       : GridView.builder(
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: gridCount < 3 ? gridCount : 3,
              crossAxisSpacing: 10.0,
              mainAxisSpacing: 10.0,
            ),
            itemCount: gridCount < 6 ? gridCount : 6,
            itemBuilder: (BuildContext context, int index) {
              return BenekAvatarGridViewBuilder(
                index: index,
                itemCount: itemCount,
                item: widget.list[index],
                shouldEnableShimmer: widget.shouldEnableShimmer || widget.list[index] is String,
              );
            }

        )
    : SizedBox(
      width: 200,
      height: 140,
      child: Center(
        child: Wrap(
          children: [
            Text(
              widget.emptyMessage != null
                  ? widget.emptyMessage!
                  : BenekStringHelpers.locale('notFoundMessage'),
              style: thinTextStyle(
                textFontSize: 15,
                textColor: AppColors.benekWhite,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
