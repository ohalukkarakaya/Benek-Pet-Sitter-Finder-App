import 'package:benek/common/widgets/story_context_component/tagged_pet_button_widget.dart';
import 'package:benek/data/models/pet_models/pet_model.dart';
import 'package:benek/data/models/user_profile_models/user_info_model.dart';
import 'package:flutter/material.dart';



import 'package:flutter_redux/flutter_redux.dart';
import 'package:benek/store/app_state.dart';
import 'package:benek/store/actions/app_actions.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../data/models/story_models/story_about_data_model.dart';
import '../../../../../../../../data/models/story_models/story_model.dart';
import 'edit_story_desc_info_card.dart';
import 'edit_story_desc_post_button.dart';
import 'edit_story_desc_text_field.dart';

class EditStoryDescSectionWidget extends StatefulWidget {
  final String src;
  final UserInfo userInfo;
  final PetModel pet;
  final String? desc;
  final Function()? closeFunction;

  const EditStoryDescSectionWidget({
    super.key,
    required this.src,
    required this.userInfo,
    required this.pet,
    this.desc,
    this.closeFunction,
  });

  @override
  State<EditStoryDescSectionWidget> createState() => _EditStoryDescSectionWidgetState();
}

class _EditStoryDescSectionWidgetState extends State<EditStoryDescSectionWidget> {
  String? writenDesc;

  bool isDescReady() {
    return writenDesc != null
        && writenDesc?.trim() != ""
        && writenDesc?.trim() != " "
        && writenDesc!.length >= 10;
  }

  @override
  void initState() {
    super.initState();
    writenDesc = widget.desc;
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: MediaQuery.of(context).size.height - 100,
      width: MediaQuery.of(context).size.width / 3,
      child: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
            decoration: const BoxDecoration(
              color: AppColors.benekBlack,
              borderRadius: BorderRadius.all(Radius.circular(6.0)),
            ),
            child: Column(
              children: [
                EditStoryDescTextFieldWidget(
                  userInfo: widget.userInfo,
                  desc: writenDesc,
                  onChanged: (value) {
                    setState(() {
                      writenDesc = value;
                    });
                  },
                ),
                const SizedBox(height: 20.0),
                TaggedPetButtonWidget(pet: widget.pet),
              ],
            ),
          ),

          EditStoryDescInfoCard(
            isReady: isDescReady(),
            color: isDescReady()
                ? AppColors.benekLightBlue
                : AppColors.benekBrick,

            darkColor: isDescReady()
                ? AppColors.benekDarkBlue
                : AppColors.benekRed,

            textColor: isDescReady()
                ? AppColors.benekBlack
                : AppColors.benekWhite,
          ),

          EditStoryDescPostButton(
            isDescReady: isDescReady(),
            onTap: () async {
              // Post the story

              var store = StoreProvider.of<AppState>( context );

              StoryModel story = StoryModel(
                storyId: null,
                about: StoryAboutDataModel(
                  aboutType: 'pet',
                  pet: widget.pet
                ),
                desc: writenDesc,
                contentUrl: widget.src,
                createdAt: DateTime.now(),
                expiresAt: DateTime.now().add(const Duration(days: 1)),
                user: widget.userInfo,
                likeCount: 0,
                didUserLiked: false,
                commentCount: 0,
                firstFiveLikedUser: [],
                comments: [],
              );

              await store.dispatch(postStoryRequestAction(story));
              widget.closeFunction != null
                  ? widget.closeFunction!()
                  : null;
            },
          )
        ],
      ),
    );
  }
}