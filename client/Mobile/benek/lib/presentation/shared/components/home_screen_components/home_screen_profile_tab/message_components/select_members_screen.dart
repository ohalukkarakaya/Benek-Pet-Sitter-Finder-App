import 'package:benek/common/constants/benek_icons.dart';
import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/widgets/benek_small_button.dart';
import 'package:benek/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:benek/presentation/shared/components/loading_components/benek_blured_modal_barier.dart';
import 'package:benek/presentation/shared/screens/user_search_screen.dart';
import 'package:flutter/material.dart';

import '../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../common/utils/styles.text.dart';
import '../../../../../../../common/widgets/benek_horizontal_button.dart';
import '../../../../../../../data/models/user_profile_models/user_info_model.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:benek/store/app_state.dart';

class SelectMembersScreen extends StatefulWidget {
  final String? desc;
  final List<UserInfo>? existingMembers;
  const SelectMembersScreen({
    super.key,
    this.desc,
    this.existingMembers,
  });

  @override
  State<SelectMembersScreen> createState() => _SelectMembersScreenState();
}

class _SelectMembersScreenState extends State<SelectMembersScreen> {
  late List<UserInfo> members;

  @override
  void initState() {
    super.initState();
    final store = StoreProvider.of<AppState>(context, listen: false);
    members = widget.existingMembers == null
      || widget.existingMembers!.isEmpty
          ? []
          : List<UserInfo>.from(widget.existingMembers!);

    members.insert(0, store.state.userInfo!);
  }

  bool isRemovable(int index) {
    if (index == 0 || index >= members.length) return false;

    final member = members[index];

    // Eğer existingMembers null ya da boşsa => herkes silinebilir
    if (widget.existingMembers == null || widget.existingMembers!.isEmpty) return true;

    // Eğer existingMembers içinde bu kullanıcı varsa => silinemez
    final exists = widget.existingMembers!.any((e) => e.userId == member.userId);
    return !exists;
  }

  @override
  Widget build(BuildContext context) {
    return BenekBluredModalBarier(
      isDismissible: true,
      onDismiss: () => Navigator.of(context).pop(),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Center(
          child: Container(
            width: 650,
            decoration: BoxDecoration(
              color: AppColors.benekBlack.withOpacity(0.6),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.all(15.0),
                  child: Text(
                      BenekStringHelpers.locale('addMembers'),
                      style: mediumTextStyle( textColor: AppColors.benekWhite ),
                  ),
                ),

                const SizedBox(height: 10.0),

                widget.desc != null
                ? Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 15.0),
                  child: Text(
                    maxLines: 4,
                    overflow: TextOverflow.ellipsis,
                    widget.desc!,
                    style: regularTextStyle(
                        textColor: AppColors.benekWhite,
                        textFontSize: 10.0
                    ),
                    softWrap: true,
                  ),
                )

                : const SizedBox(),

                const SizedBox(height: 25.0),

                Padding(
                  padding: const EdgeInsets.only(left: 10.0),
                  child: Row(
                    children: List.generate(
                        5,
                        (index){
                          return Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 5.0),
                            child: Stack(
                              children: [

                                Container(
                                  width: 115,
                                  height: 95,
                                ),

                                Positioned(
                                  right: 0,
                                  bottom: 0,
                                  child: Container(
                                    width: 110.0,
                                    padding: const EdgeInsets.all(10.0),
                                    decoration: BoxDecoration(
                                      color: AppColors.benekLightBlue,
                                      borderRadius: BorderRadius.circular(6.0),
                                    ),
                                    child: Column(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      crossAxisAlignment: CrossAxisAlignment.center,
                                      children: [
                                        members.isNotEmpty
                                        && index <= members.length - 1
                                        ? BenekCircleAvatar(
                                            width: 45.0,
                                            height: 45.0,
                                            radius: 30.0,
                                            isDefaultAvatar: members[index].profileImg!.isDefaultImg!,
                                            imageUrl: members[index].profileImg!.imgUrl!,
                                            bgColor: AppColors.benekBlack,
                                          )
                                        : Container(
                                            width: 45.0,
                                            height: 45.0,
                                            decoration: BoxDecoration(
                                              color: AppColors.benekBlack,
                                              borderRadius: BorderRadius.circular(30.0),
                                            ),
                                            child: Center(
                                              child: Container(
                                                width: 40.0,
                                                height: 40.0,
                                                decoration: BoxDecoration(
                                                  color: AppColors.benekGrey,
                                                  borderRadius: BorderRadius.circular(30.0),
                                                ),

                                              ),
                                            ),
                                        ),

                                        const SizedBox(height: 10.0),

                                        members.isNotEmpty
                                        && index <= members.length - 1
                                        ? Text(
                                            members[index].userName!,
                                            style: TextStyle(
                                              fontFamily: defaultFontFamily(),
                                              fontSize: 12.0,
                                              fontWeight: getFontWeight('regular'),
                                              color: AppColors.benekBlack,
                                            ),
                                            overflow: TextOverflow.ellipsis,
                                            softWrap: false,
                                          )
                                        : Container(
                                          width: 50.0,
                                          height: 15.0,
                                          decoration: BoxDecoration(
                                            color: AppColors.benekBlack,
                                            borderRadius: BorderRadius.circular(2.0),
                                          ),
                                        )
                                      ],
                                    ),
                                  ),
                                ),

                                isRemovable(index)
                                  ? Positioned(
                                    left: 0.0,
                                    top: 0.0,
                                    child: InkWell(
                                      onTap: () {
                                        setState(() {
                                          members.removeAt(index);
                                        });
                                      },
                                      child: Container(
                                        width: 25.0,
                                        height: 25.0,
                                        decoration: BoxDecoration(
                                          color: AppColors.benekBlack,
                                          borderRadius: BorderRadius.circular(30.0),
                                        ),
                                        child: Center(
                                          child: Container(
                                            width: 21.0,
                                            height: 21.0,
                                            decoration: BoxDecoration(
                                              color: AppColors.benekWhite,
                                              borderRadius: BorderRadius.circular(30.0),
                                            ),
                                            child: Center(
                                              child: Icon(
                                                BenekIcons.times,
                                                color: AppColors.benekBlack,
                                                size: 10.0,

                                            ),
                                          ),
                                        ),
                                      ),
                                     ),
                                    )
                                )
                                  : const SizedBox(),
                              ],
                            ),
                          );
                        }
                    )
                  ),
                ),

                Padding(
                  padding: const EdgeInsets.all(15.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      BenekHorizontalButton(
                        text: BenekStringHelpers.locale('selectAMember'),
                        isLight: true,
                        isPassive: members.length >= 5,
                        onTap: () async {
                          UserInfo? seletedMember = await Navigator.push(
                            context,
                            PageRouteBuilder(
                              opaque: false,
                              barrierDismissible: false,
                              pageBuilder: (context, _, __) => const KulubeUserSearchScreen(
                                isForUserProfile: false,
                              ),
                            ),
                          );

                          if (seletedMember != null) {
                            bool isUserAlreadySelected = members.any((element) => element.userId == seletedMember.userId);
                            if( isUserAlreadySelected ){ return; }

                            setState(() {
                              members.add(seletedMember);
                            });
                          }
                        }
                      ),

                      BenekSmallButton(
                          iconData: BenekIcons.checksquare,
                          isLight: true,
                          isPassive:
                            members.isEmpty
                            || (
                              widget.existingMembers != null
                              && members.length - widget.existingMembers!.length < 2
                            )
                            || (
                              widget.existingMembers == null
                              && members.length < 2
                            ),
                          onTap: () {
                            Navigator.of(context).pop(members);
                          }
                      )
                    ],
                  ),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
