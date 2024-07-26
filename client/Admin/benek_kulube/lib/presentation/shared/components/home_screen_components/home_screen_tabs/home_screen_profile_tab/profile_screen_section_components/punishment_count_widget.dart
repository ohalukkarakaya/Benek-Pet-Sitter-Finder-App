import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:el_tooltip/el_tooltip.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../features/user_profile_helpers/punishment_helper.dart';

class PunishmentCountWidget extends StatefulWidget {
  final int? punishmentCount;

  const PunishmentCountWidget({
    super.key,
    this.punishmentCount
  });

  @override
  State<PunishmentCountWidget> createState() => _PunishmentCountWidgetState();
}

class _PunishmentCountWidgetState extends State<PunishmentCountWidget> {
  final ElTooltipController _punishWidgetTooltipController = ElTooltipController();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(
          top: 20.0,
          right: 40.0
      ),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all( 17.0 ),
        decoration: BoxDecoration(
          color: AppColors.benekBlack.withOpacity(0.2),
          borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
        ),
        child: widget.punishmentCount != null
        ? Center(
          child: ElTooltip(
            color: AppColors.benekBlack,
            showModal: false,
            showChildAboveOverlay: false,
            position: ElTooltipPosition.bottomCenter,
            content:  Text(
                widget.punishmentCount! > 0
                    ? '${widget.punishmentCount} ${BenekStringHelpers.locale('punishment')}'
                    : BenekStringHelpers.locale('noPunishment'),
                style: const TextStyle(
                    color: AppColors.benekWhite,
                    fontSize: 12.0,
                    fontWeight: FontWeight.w500,
                    fontFamily: 'Qanelas'
                )
            ),
            controller: _punishWidgetTooltipController,
            child: MouseRegion(
              onEnter: (_) {
                setState(() {
                  if(
                  _punishWidgetTooltipController.value != ElTooltipStatus.showing
                   && widget.punishmentCount != null
                  ){
                    _punishWidgetTooltipController.show();
                  }
                });
              },
              onExit: (_) {
                setState(() {
                  if( _punishWidgetTooltipController.value != ElTooltipStatus.hidden ){
                    _punishWidgetTooltipController.hide();
                  }
                });
              },
              child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: List.generate(
                      3,
                      (index){
                        return Padding(
                          padding: const EdgeInsets.all(5.0),
                          child: Icon(
                            Icons.block,
                            color: index + 1 <= widget.punishmentCount!
                                ? PunishmentHelper.getPunishmentColor( index + 1 )
                                : AppColors.benekBlack,
                            size: 30,
                          ),
                        );
                      }
                  ),
                ),
            ),
          ),
        )
        : Shimmer.fromColors(
          baseColor: AppColors.benekBlack.withOpacity(0.5),
          highlightColor: AppColors.benekBlack.withOpacity(0.2),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: List.generate(
                3,
                (index){
                  return const Padding(
                    padding: EdgeInsets.all(5.0),
                    child: Icon(
                      Icons.block,
                      color: AppColors.benekBlack,
                      size: 30,
                    ),
                  );
                }
            ),
          )
        )
      ),
    );
  }
}
