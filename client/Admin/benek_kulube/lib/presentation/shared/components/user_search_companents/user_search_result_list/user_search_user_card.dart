import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/constants/benek_icons.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:flutter/material.dart';

class KulubeUserCard extends StatefulWidget {
  const KulubeUserCard({
    super.key,
    required this.index,
    required this.indexOfLastRevealedItem,
    required this.resultData,
    this.onAnimationComplete,
  });

  final int index;
  final int indexOfLastRevealedItem;
  final UserInfo resultData;
  final void Function()? onAnimationComplete;

  @override
  State<KulubeUserCard> createState() => _KulubeUserCardState();
}

class _KulubeUserCardState extends State<KulubeUserCard> {
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
            trailing: widget.resultData.isCareGiver != null
              && widget.resultData.isCareGiver!
                  ? Container(
                    decoration: BoxDecoration(
                      borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
                      border: Border.all(
                        color: isHovering ? AppColors.benekBlack : AppColors.benekWhite,
                        width: 2.0
                      )
                    ),
                    padding: const EdgeInsets.only(top: 10.0, bottom: 10.0, left: 9.0, right: 11.0),
                    child: Icon(
                      BenekIcons.paw,
                      size: 17.0,
                      color: isHovering ? AppColors.benekBlack : AppColors.benekWhite,
                    ),
                  )
                  : null,
          ),
        ),
      ),
    );
  }
}