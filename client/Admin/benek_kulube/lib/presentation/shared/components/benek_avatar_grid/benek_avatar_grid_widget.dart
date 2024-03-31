import 'dart:developer';

import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
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
      child: BenekAvatarGridViewWidget(
          list: widget.list,
          emptyMessage: widget.emptyMessage,
          shouldEnableShimmer: widget.shouldEnableShimmer || widget.list[0] is String,
      ),
    );
  }
}
