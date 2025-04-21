import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/constants/benek_icons.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:benek_kulube/presentation/features/user_profile_helpers/auth_role_helper.dart';
import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:flutter/material.dart';

class EmployeeCard extends StatefulWidget {
  const EmployeeCard({
    super.key,
    required this.index,
    required this.indexOfLastRevealedItem,
    required this.resultData,
    this.onAnimationComplete,
    this.onUserClickCallback,
  });

  final int index;
  final int indexOfLastRevealedItem;
  final UserInfo resultData;
  final void Function()? onAnimationComplete;
  final Function( UserInfo )? onUserClickCallback;

  @override
  State<EmployeeCard> createState() => _EmployeeCardState();
}

class _EmployeeCardState extends State<EmployeeCard> {
  bool isHovering = false;
  bool startAnimation = false;

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      setState(() {
        startAnimation = true;
      });
    });
  }

  @override
  Widget build(BuildContext context) {

    double screenWidth = MediaQuery.of(context).size.width;

    int indexForAnimationDuration = widget.index - widget.indexOfLastRevealedItem;

    String middleName = widget.resultData.identity!.middleName != null ? "${widget.resultData.identity!.middleName!} " : "";
    String usersFullName = "${widget.resultData.identity!.firstName!} $middleName${widget.resultData.identity!.lastName!}";

    return GestureDetector(
      onTap: () {
        widget.onUserClickCallback!(widget.resultData);
      },
      child: MouseRegion(
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
          decoration: BoxDecoration(
            color: isHovering ? AppColors.benekLightBlue : AppColors.benekBlack,
            borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
          ),

          // Reveal Animation
          child: AnimatedContainer(
            duration: Duration( milliseconds: 300 + ((indexForAnimationDuration * 10) + 100) ),
            transform: widget.indexOfLastRevealedItem < widget.index
                ? Matrix4.translationValues(startAnimation ? 0 : screenWidth, 0, 0)
                : null,
            onEnd: (){
              widget.onAnimationComplete!();
            },
            child: ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 4.0),
              leading: BenekCircleAvatar(
                imageUrl: widget.resultData.profileImg!.imgUrl!,
                width: 30.0,
                height: 30.0,
                radius: 20.0,
                borderWidth: 2,
                isDefaultAvatar: widget.resultData.profileImg!.isDefaultImg ?? true,
                bgColor: isHovering ? AppColors.benekBlack : AppColors.benekWhite,
              ),
              title: Text(
                "@${widget.resultData.userName!}",
                style: TextStyle(
                    fontFamily: defaultFontFamily(),
                    fontSize: 15.0,
                    fontWeight: getFontWeight('medium'),
                    color: isHovering ? Colors.black : null
                ),
              ),
              subtitle: Text(
                usersFullName,
                style: TextStyle(
                    fontFamily: defaultFontFamily(),
                    fontSize: 15.0,
                    fontWeight: getFontWeight('light'),
                    color: isHovering ? Colors.black : null
                ),
              ),
              trailing: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
                decoration: BoxDecoration(
                  color: !isHovering
                    ? AppColors.benekWhite.withOpacity(0.2)
                    : AppColors.benekBlack,
                  borderRadius: BorderRadius.circular(4.0),
                ),
                child: Text(
                  AuthRoleHelper.getAuthRoleDataFromId(
                    widget.resultData.authRole!,
                  ).authRoleText,
                  style: TextStyle(
                      fontFamily: defaultFontFamily(),
                      fontSize: 15.0,
                      fontWeight: getFontWeight('medium'),
                      color: AuthRoleHelper.getAuthRoleDataFromId(
                        widget.resultData.authRole!,
                      ).authRoleColor,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
