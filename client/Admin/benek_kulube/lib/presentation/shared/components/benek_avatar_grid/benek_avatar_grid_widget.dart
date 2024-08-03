import 'dart:developer';

import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:el_tooltip/el_tooltip.dart';
import 'package:flutter/material.dart';

import '../../../../common/constants/app_colors.dart';
import '../../../../data/models/pet_models/pet_model.dart';
import 'benek_avatar_grid_view.dart';

class BenekAvatarGridWidget extends StatefulWidget {
  final List<dynamic> list;
  final String? emptyMessage;
  final bool shouldEnableShimmer;
  const BenekAvatarGridWidget({
    super.key,
    required this.list,
    this.emptyMessage,
    this.shouldEnableShimmer = true,
  });

  @override
  State<BenekAvatarGridWidget> createState() => _BenekAvatarGridWidgetState();
}

class _BenekAvatarGridWidgetState extends State<BenekAvatarGridWidget> {
  final ElTooltipController _tooltipControllerGeneralGrid = ElTooltipController();
  @override
  Widget build(BuildContext context) {
    // log('First Pet: ${list[4].name?.toString()}');
    return Container(
      width: 200,
      height: 200,
      padding: const EdgeInsets.all(10.0),
      decoration: BoxDecoration(
        color: AppColors.benekBlackWithOpacity,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            BenekStringHelpers.locale('usersPets'),
            style: regularTextStyle( textColor: AppColors.benekWhite ),
          ),
          const Divider(color: AppColors.benekWhite, thickness: 0.5),
          Padding(
            padding: const EdgeInsets.only( top: 25.0),
            child: SizedBox(
              width: 200,
              height: 120,
              child: BenekAvatarGridViewWidget(
                  list: widget.list,
                  emptyMessage: widget.emptyMessage,
                  shouldEnableShimmer: widget.shouldEnableShimmer
                                       || (
                                            widget.list != null
                                            && widget.list.isNotEmpty
                                            && widget.list[0] is String
                                      ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
