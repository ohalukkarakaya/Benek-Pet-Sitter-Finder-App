import 'package:benek/data/models/user_profile_models/user_info_model.dart';
import 'package:flutter/material.dart';

import '../../../../common/constants/app_colors.dart';
import '../../../../data/models/pet_models/pet_model.dart';
import 'benek_horizontal_avatar_stack.dart';
import 'benek_pet_list_detailed.dart';

class BenekPetStackWidget extends StatefulWidget {
  final bool isPetList;
  final List<dynamic>? petList;

  const BenekPetStackWidget({
    super.key,
    this.isPetList = true,
    required this.petList,
  });

  @override
  State<BenekPetStackWidget> createState() => _BenekPetStackWidgetState();
}

class _BenekPetStackWidgetState extends State<BenekPetStackWidget> {

  @override
  Widget build(BuildContext context) {
    return Center(
      child: GestureDetector(
        onTap: () {
      
          if(widget.petList == null || widget.petList!.isEmpty || ( widget.petList![0] !is! PetModel && widget.petList![0] !is! UserInfo ) ){
            return;
          }
      
          Navigator.push(
            context,
            PageRouteBuilder(
              opaque: false,
              barrierDismissible: true,
              pageBuilder: (context, _, __) => const BenekPetListDetailedScreen(),
            ),
          );
        },
        child: Container(
          width: 200,
          decoration: widget.petList == null || widget.petList!.isEmpty
            ? BoxDecoration(
              color: AppColors.benekBlackWithOpacity,
              borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
            )
            : null,
          padding: widget.petList == null || widget.petList!.isEmpty
            ? const EdgeInsets.symmetric( horizontal: 10.0, vertical: 5.0 )
            : null,
          child: BenekHorizontalStackedPetAvatarWidget(
            size: 40,
            petList: widget.petList,
          ),
        ),
      ),
    );
  }
}
