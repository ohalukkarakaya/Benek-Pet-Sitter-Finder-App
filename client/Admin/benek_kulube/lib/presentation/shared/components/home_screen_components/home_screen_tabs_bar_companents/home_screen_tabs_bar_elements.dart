import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/utils/state_utils/auth_utils/auth_utils.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:flutter/material.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:redux/redux.dart';

import '../../../../../common/constants/tabs_enum.dart';

class TabsButonElement extends StatefulWidget {
  final AppTabsEnums tab;
  final Store<AppState> store;
  final IconData icon;
  final String title;
  final bool shouldShowTextWhenDeActive;
  
  const TabsButonElement({
    Key? key,
    required this.tab,
    required this.store,
    required this.icon,
    required this.title,
    this.shouldShowTextWhenDeActive = false,
  }) : super(key: key);

  @override
  State<TabsButonElement> createState() => _TabsButonElementState();
}

class _TabsButonElementState extends State<TabsButonElement> {
  bool isHovering = false;
  
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () async {
         widget.tab == AppTabsEnums.LOGOUT_TAB
          ? await AuthUtils.killUserSessionAndRestartApp( widget.store )
          : await widget.store.dispatch(ChangeTabAction( widget.tab ) );
      },
      child: MouseRegion(
        onHover: ( event ){
          if( 
            widget.store.state.activeTab == widget.tab
            || widget.shouldShowTextWhenDeActive
            || isHovering
          ){
            setState(() {
              isHovering = true;
            });
          }
        },
        onExit: (event) {
          if( 
            widget.store.state.activeTab == widget.tab
            || widget.shouldShowTextWhenDeActive
            || isHovering
          ){
            setState(() {
              isHovering = false;
            });
          }
        },
        child: Container(
          width: 150,
          padding: const EdgeInsets.symmetric( vertical: 15.0, horizontal: 20.0 ),
          decoration: isHovering 
                      || widget.store.state.activeTab == widget.tab
                        ? BoxDecoration(
                            color: AppColors.benekLightBlue,
                            borderRadius: const BorderRadius.all( Radius.circular( 5.0 ) ),
                            boxShadow:[
                              BoxShadow(
                                color:  AppColors.benekLightBlue.withOpacity(0.3),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ]
                          )
                          : null,
          child: Row(
            children: [
              MouseRegion(
                onHover: ( event ){
                  setState(() {
                    isHovering = true;
                  });
                },
                child: Icon(
                  widget.icon, 
                  size: 20.0, 
                  color: isHovering
                         || widget.store.state.activeTab == widget.tab
                          ? Colors.black 
                          : null,
                ),
              ),
              const SizedBox( width: 10,),
              widget.store.state.activeTab == widget.tab
              || widget.shouldShowTextWhenDeActive
              || isHovering
                ? Text(
                  widget.title,
                  style: TextStyle(
                    fontFamily: 'Qanelas',
                    fontSize: 15.0,
                    fontWeight: FontWeight.w500,
                    color: isHovering || widget.store.state.activeTab == widget.tab ? Colors.black : null
                  ),
                )
                : const SizedBox()
            ],
          ),
        ),
      ),
    );
  }
}