import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:flutter/material.dart';

class KulubeUserCard extends StatefulWidget {
  const KulubeUserCard({
    super.key,
    required this.itemKey,
    required this.resultData,
  });

  final GlobalKey<State<StatefulWidget>> itemKey;
  final UserInfo resultData;

  @override
  State<KulubeUserCard> createState() => _KulubeUserCardState();
}

class _KulubeUserCardState extends State<KulubeUserCard> {
  bool isHovering = false;

  @override
  Widget build(BuildContext context) {
    String middleName = widget.resultData.identity!.middleName != null ? "${widget.resultData.identity!.middleName!} " : "";
    String usersFullName = "${widget.resultData.identity!.firstName!} $middleName${widget.resultData.identity!.lastName!}";

    return MouseRegion(
        onHover: ( event ){
          setState(() {
              isHovering = true;
          });
        },
        onExit: (event) {
          setState(() {
              isHovering = false;
          });
        },
      child: Container(
        key: widget.itemKey,
        decoration: BoxDecoration(
          color: isHovering ? AppColors.benekLightBlue : AppColors.benekBlack,
          borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
        ),
        child: ListTile(
          leading: BenekCircleAvatar(
            imageUrl: widget.resultData.profileImg!.imgUrl!,
            width: 40.0,
            height: 40.0,
            radius: 20.0,
            isDefaultAvatar: widget.resultData.profileImg!.isDefaultImg!,
            bgColor: isHovering ? AppColors.benekBlack : AppColors.benekWhite,
          ),
          title: Row(
            children: [
              Text(
                "@${widget.resultData.userName!} | ",
                style: TextStyle(
                  fontFamily: 'Qanelas',
                  fontSize: 15.0,
                  fontWeight: FontWeight.w500,
                  color: isHovering ? Colors.black : null
                ),
              ),
              Text(
                usersFullName,
                style: TextStyle(
                  fontFamily: 'Qanelas',
                  fontSize: 15.0,
                  fontWeight: FontWeight.w300,
                  color: isHovering ? Colors.black : null
                ),
              ),
            ],
          ),
          subtitle: Text(
            widget.resultData.identity!.bio!,
            style: TextStyle(
              fontFamily: 'Qanelas',
              fontSize: 12.0,
              fontWeight: FontWeight.w400,
              color: isHovering ? Colors.black : null
            ),
          ),
        ),
      ),
    );
  }
}