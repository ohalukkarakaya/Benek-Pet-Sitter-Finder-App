import 'package:benek_kulube/data/models/pet_models/pet_model.dart';
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
    int itemCount = widget.list.length;
    int gridCount = itemCount > 9 ? 9 : itemCount;

    return itemCount > 0
    ? widget.shouldEnableShimmer
      ? Shimmer.fromColors(
          baseColor: AppColors.benekBlack.withOpacity(0.5),
          highlightColor: AppColors.benekBlack.withOpacity(0.2),
          enabled: widget.shouldEnableShimmer,
          child: GridView.builder(
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: gridCount < 3 ? gridCount : 3,
                crossAxisSpacing: 10.0,
                mainAxisSpacing: 10.0,
              ),
              itemCount: gridCount < 9 ? gridCount : 9,
              itemBuilder: (BuildContext context, int index) {
                return BenekAvatarGridViewBulder(
                  index: index,
                  itemCount: itemCount,
                  item: widget.list[index] is PetModel ? widget.list[index] : null,
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
            itemCount: gridCount < 9 ? gridCount : 9,
            itemBuilder: (BuildContext context, int index) {
              return widget.list[index] is PetModel
              ? BenekAvatarGridViewBulder(
                index: index,
                itemCount: itemCount,
                item: widget.list[index],
                shouldEnableShimmer: widget.shouldEnableShimmer || widget.list[index] is String,
              )
              : const SizedBox();
            }

        )
    : widget.emptyMessage != null
      ? Center(
          child: Text(
            widget.emptyMessage!,
            style: const TextStyle(
              color: AppColors.benekWhite,
              fontFamily: 'Qanelas',
              fontSize: 16,
            ),
          ),
        )
      : const SizedBox();
  }
}
