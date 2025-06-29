import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:benek/presentation/features/user_profile_helpers/punishment_helper.dart';
import 'package:benek/presentation/shared/components/home_screen_components/home_screen_profile_tab/profile_screen_section_components/punishment_detail_screen.dart';
import 'package:benek/store/app_state.dart';
import 'package:el_tooltip/el_tooltip.dart';
import 'package:flutter/material.dart';
import 'package:flutter/material.dart';

import 'package:flutter_redux/flutter_redux.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../../../../common/constants/app_colors.dart';

class PunishmentCountWidget extends StatefulWidget {

  const PunishmentCountWidget({
    super.key,
  });

  @override
  State<PunishmentCountWidget> createState() => _PunishmentCountWidgetState();
}

class _PunishmentCountWidgetState extends State<PunishmentCountWidget> {
  final ElTooltipController _punishWidgetTooltipController = ElTooltipController();

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, int?>(
        converter: (store) => store.state.selectedUserInfo!.punishmentInfo?.punishmentCount,
        builder: (BuildContext context, int? punishmentCount){
          return Padding(
            padding: const EdgeInsets.only(
                top: 20.0,
                right: 40.0
            ),
            child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all( 17.0 ),
                decoration: BoxDecoration(
                  color: AppColors.benekBlack.withAlpha((0.2 * 255).toInt()),
                  borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
                ),
                child: punishmentCount != null
                    ? Center(
                  child: ElTooltip(
                    color: AppColors.benekBlack,
                    showModal: false,
                    showChildAboveOverlay: false,
                    position: ElTooltipPosition.bottomCenter,
                    content:  Text(
                        punishmentCount > 0
                            ? '$punishmentCount ${BenekStringHelpers.locale('punishment')}'
                            : BenekStringHelpers.locale('noPunishment'),
                        style: mediumTextStyle(
                            textColor: AppColors.benekWhite
                        )
                    ),
                    controller: _punishWidgetTooltipController,
                    child: GestureDetector(
                      onTap: (){
                        if( punishmentCount == null || punishmentCount == 0 ) return;

                        Navigator.push(
                          context,
                          PageRouteBuilder(
                            opaque: false,
                            barrierDismissible: true,
                            pageBuilder: (context, _, __) => PunishmentDetailScreen(
                              punishmentCount: punishmentCount,
                            ),
                          ),
                        );
                      },
                      child: MouseRegion(
                        cursor: punishmentCount != null && punishmentCount > 0
                            ? SystemMouseCursors.click
                            : SystemMouseCursors.basic,
                        onEnter: (_) {
                          setState(() {
                            if(
                            _punishWidgetTooltipController.value != ElTooltipStatus.showing
                                && punishmentCount != null
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
                                    color: index + 1 <= punishmentCount
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
                  ),
                )
                    : Shimmer.fromColors(
                    baseColor: AppColors.benekBlack.withAlpha((0.5 * 255).toInt()),
                    highlightColor: AppColors.benekBlack.withAlpha((0.2 * 255).toInt()),
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
    );
  }
}
