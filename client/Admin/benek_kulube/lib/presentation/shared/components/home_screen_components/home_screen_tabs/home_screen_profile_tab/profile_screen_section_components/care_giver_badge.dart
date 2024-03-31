import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:el_tooltip/el_tooltip.dart';
import 'package:flutter/widgets.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../common/constants/benek_icons.dart';

class CareGiverBadge extends StatefulWidget {
  final bool isCareGiver;
  const CareGiverBadge({
    super.key,
    required this.isCareGiver
  });

  @override
  State<CareGiverBadge> createState() => _CareGiverBadgeState();
}

class _CareGiverBadgeState extends State<CareGiverBadge> {
  final ElTooltipController _tooltipController = ElTooltipController();

  @override
  Widget build(BuildContext context) {

    return Center(
      child: ElTooltip(
        color: AppColors.benekLightBlue,
        showModal: false,
        position: ElTooltipPosition.bottomCenter,
        content:  Text(
            widget.isCareGiver
                ? BenekStringHelpers.locale('userIsCareGiver')
                : BenekStringHelpers.locale('userIsNotCareGiver'),
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
            padding: const EdgeInsets.all(6.0),
            decoration: BoxDecoration(
              color: AppColors.benekBlack.withOpacity(0.2),
              borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
            ),
            child: Container(
                  decoration: BoxDecoration(
                  borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
                  border: Border.all(
                      color: widget.isCareGiver
                              ? AppColors.benekWhite
                              : AppColors.benekRed,
                      width: 2.0
                  )),
                padding: const EdgeInsets.only(top: 10.0, bottom: 10.0, left: 9.0, right: 11.0),
                child: Icon(
                  BenekIcons.paw,
                  size: 15.0,
                  color: widget.isCareGiver
                      ? AppColors.benekWhite
                      : AppColors.benekRed,
                )
            ),
          ),
        ),
      ),
    );
  }
}
