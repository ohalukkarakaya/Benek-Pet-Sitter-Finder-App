import 'package:benek/data/models/user_profile_models/user_info_model.dart';
import 'package:flutter/widgets.dart';

import '../adress_row/adress_map.dart';
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
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        ProfileAdresMapWidget(
          userLocation: widget.userInfo.location!,
        ),
        ProfileAdressWidget(
          isEdit: true,
          openAdress: widget.userInfo.identity?.openAdress,
          isDark: true,
          location: widget.userInfo.location,
          width: 450,
          longButtonWidth: 350,
          onEdit: () async {
            await Navigator.push(
              context,
              PageRouteBuilder(
                opaque: false,
                barrierDismissible: false,
                pageBuilder: (context, _, __) => ChooseLocationFromMapScreen( userInfo: widget.userInfo,),
              ),
            );

            setState(() {
              idle = !idle;
            });
          },
        ),
      ],
    );
  }
}
