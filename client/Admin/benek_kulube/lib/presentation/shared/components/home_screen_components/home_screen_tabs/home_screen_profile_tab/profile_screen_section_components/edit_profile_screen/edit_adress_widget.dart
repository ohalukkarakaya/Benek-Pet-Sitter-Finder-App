import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:flutter/widgets.dart';

import '../adress_row/adress_map.dart';
import '../profile_adress_widget.dart';

class EditAdressWidget extends StatelessWidget {
  final UserInfo userInfo;

  const EditAdressWidget({
    super.key,
    required this.userInfo,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        ProfileAdresMapWidget(
          userLocation: userInfo.location!,
        ),
        ProfileAdressWidget(
          isEdit: true,
          openAdress: userInfo.identity?.openAdress,
          isDark: true,
          location: userInfo.location,
          width: 450,
          longButtonWidth: 350,
        ),
      ],
    );
  }
}
