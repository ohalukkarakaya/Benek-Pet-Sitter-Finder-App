import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:el_tooltip/el_tooltip.dart';
import 'package:flutter/material.dart';

import '../../../../common/constants/app_colors.dart';
import '../../../../data/models/pet_models/pet_model.dart';

class BenekAvatarGridViewBuilder extends StatefulWidget {
  final int index;
  final int itemCount;
  final dynamic item;
  final bool shouldEnableShimmer;

  const BenekAvatarGridViewBuilder({
    super.key,
    required this.index,
    required this.itemCount,
    required this.item,
    this.shouldEnableShimmer = true,
  });

  @override
  State<BenekAvatarGridViewBuilder> createState() => _BenekAvatarGridViewBuilderState();
}

class _BenekAvatarGridViewBuilderState extends State<BenekAvatarGridViewBuilder> {
  final ElTooltipController _tooltipController = ElTooltipController();

  @override
  Widget build(BuildContext context) {
    if(
      widget.index == 5
      && widget.itemCount > 6
      && widget.item is PetModel
    ){
      return Center(
        child: ElTooltip(
          controller: _tooltipController,
          color: AppColors.benekBlack,
          showModal: false,
          showChildAboveOverlay: false,
          position: ElTooltipPosition.bottomCenter,
          content:  widget.item!.name != null
              ? Text(
              BenekStringHelpers.locale('seeAll'),
              style: mediumTextStyle(
                textColor: AppColors.benekWhite,
                textFontSize: 15.0
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
            child: Container(
              height: 50,
              width: 50,
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
                    "+ ${widget.itemCount - 5}",
                    style: boldTextStyle( textFontSize: 15.0 ),
                  ),
                ),
              ),
            ),
          ),
        ),
      );
    }else if(
      widget.shouldEnableShimmer
      ||  widget.item is! PetModel
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
          showChildAboveOverlay: false,
          position: ElTooltipPosition.bottomCenter,
          content:  widget.item!.name != null
            ? Text(
                '@${widget.item!.name}',
                style: mediumTextStyle(
                  textColor: AppColors.benekWhite,
                  textFontSize: 15.0
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
