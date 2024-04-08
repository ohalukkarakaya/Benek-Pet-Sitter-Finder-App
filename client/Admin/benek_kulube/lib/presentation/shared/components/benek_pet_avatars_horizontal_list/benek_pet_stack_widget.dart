import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:el_tooltip/el_tooltip.dart';
import 'package:flutter/material.dart';

import '../../../../common/constants/app_colors.dart';
import 'benek_horizontal_avatar_stack.dart';

class BenekPetStackWidget extends StatefulWidget {
  final List<dynamic>? petList;

  const BenekPetStackWidget({
    super.key,
    required this.petList,
  });

  @override
  State<BenekPetStackWidget> createState() => _BenekPetStackWidgetState();
}

class _BenekPetStackWidgetState extends State<BenekPetStackWidget> {
  ElTooltipController _tooltipController = ElTooltipController();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ElTooltip(
        color: AppColors.benekLightBlue,
        showModal: false,
        showChildAboveOverlay: false,
        position: ElTooltipPosition.bottomCenter,
        content:  Text(
            BenekStringHelpers.locale('usersPets'),
            style: const TextStyle(
                color: AppColors.benekBlack,
                fontSize: 12.0,
                fontWeight: FontWeight.w500,
                fontFamily: 'Qanelas'
            )
        ),
        controller: _tooltipController,
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
            width: 200,
            decoration: BoxDecoration(
              color: AppColors.benekBlackWithOpacity,
              borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
            ),
            padding: const EdgeInsets.symmetric( horizontal: 10.0, vertical: 5.0 ),
            child: BenekHorizontalStackedPetAvatarWidget(
              size: 40,
              petList: widget.petList,
            ),
          ),
        ),
      ),
    );
  }
}
