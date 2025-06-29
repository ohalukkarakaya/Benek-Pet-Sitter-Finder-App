import 'package:benek/data/models/user_profile_models/user_info_model.dart';
import 'package:flutter/material.dart';

import '../profile_adress_widget.dart';
import 'choose_location_from_map/choose_location_from_map_screen.dart';

class EditAdressWidget extends StatefulWidget {
  final UserInfo userInfo;

  const EditAdressWidget({
    super.key,
    required this.userInfo,
  });

  @override
  State<EditAdressWidget> createState() => _EditAdressWidgetState();
}

class _EditAdressWidgetState extends State<EditAdressWidget> {
  bool idle = true;
  
  @override
Widget build(BuildContext context) {
  double screenWidth = MediaQuery.of(context).size.width;

  double widgetWidth;
  double longButtonWidth;

  if (screenWidth > 1000) {
    widgetWidth = 450;
    longButtonWidth = 350;
  } else if (screenWidth > 700) {
    widgetWidth = screenWidth * 0.6;
    longButtonWidth = screenWidth * 0.5;
  } else {
    widgetWidth = screenWidth * 0.9;
    longButtonWidth = screenWidth * 0.8;
  }

  return Center( // 👈 Row yerine Center kullan
    child: ProfileAdressWidget(
      isEdit: true,
      openAdress: widget.userInfo.identity?.openAdress,
      isDark: true,
      location: widget.userInfo.location,
      width: widgetWidth,
      longButtonWidth: longButtonWidth,
      onEdit: () async {
        await Navigator.push(
          context,
          PageRouteBuilder(
            opaque: false,
            barrierDismissible: false,
            pageBuilder: (context, _, __) => ChooseLocationFromMapScreen(),
          ),
        );

        setState(() {
          idle = !idle;
        });
      },
    ),
  );
}


}
