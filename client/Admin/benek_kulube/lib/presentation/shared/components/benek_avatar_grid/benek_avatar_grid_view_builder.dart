import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:el_tooltip/el_tooltip.dart';
import 'package:flutter/material.dart';

import '../../../../common/constants/app_colors.dart';
import '../../../../data/models/pet_models/pet_model.dart';

class BenekAvatarGridViewBulder extends StatefulWidget {
  final int index;
  final int itemCount;
  final PetModel? item;
  final bool shouldEnableShimmer;

  const BenekAvatarGridViewBulder({
    super.key,
    required this.index,
    required this.itemCount,
    required this.item,
    this.shouldEnableShimmer = true,
  });

  @override
  State<BenekAvatarGridViewBulder> createState() => _BenekAvatarGridViewBulderState();
}

class _BenekAvatarGridViewBulderState extends State<BenekAvatarGridViewBulder> {
  final ElTooltipController _tooltipController = ElTooltipController();

  @override
  Widget build(BuildContext context) {
    if( widget.index == 8 && widget.itemCount > 9 ){
      return Container(
        decoration: BoxDecoration(
          color: AppColors.benekWhite,
          borderRadius: BorderRadius.circular(100),
        ),
        padding: const EdgeInsets.all(4),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(100),
            color: AppColors.benekLightBlue,
          ),
          child: Center(
            child: Text(
              "+ ${widget.itemCount - 8}",
              style: const TextStyle(
                color: AppColors.benekBlack,
                fontSize: 15,
                fontFamily: 'Qanelas',
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
      );
    }else if(
      widget.shouldEnableShimmer
      || widget.item is String
    ){
      return Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(100),
          color: AppColors.benekLightBlue,
        ),
      );
    }else{
      return Center(
        child: ElTooltip(
          controller: _tooltipController,
          color: AppColors.benekBlack,
          showModal: false,
          position: ElTooltipPosition.bottomCenter,
          content:  widget.item!.name != null
            ? Text(
                '@${widget.item!.name}',
                style: const TextStyle(
                    color: AppColors.benekWhite,
                    fontSize: 15.0,
                    fontWeight: FontWeight.w500,
                    fontFamily: 'Qanelas'
                )
            )
            : const SizedBox(),
          child: MouseRegion(
            onHover: (event) {
              setState(() {
                if( _tooltipController.value != ElTooltipStatus.showing ){
                  _tooltipController.show();
                }
              });
            },
            onExit: (event) {
              setState(() {
                if( _tooltipController.value != ElTooltipStatus.hidden ){
                  _tooltipController.hide();
                }
              });
            },
            child: BenekCircleAvatar(
                isDefaultAvatar: widget.item!.petProfileImg!.isDefaultImg!,
                imageUrl: widget.item!.petProfileImg!.imgUrl!,
                width: 50,
                height: 50,
            ),
          ),
        ),
      );
    }
  }
}
