import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/data/models/pet_models/pet_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:flutter/widgets.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/widgets/story_context_component/tagged_pet_button_widget.dart';
import 'edit_story_desc_post_button.dart';
import 'edit_story_desc_text_field.dart';

class EditStoryDescSectionWidget extends StatefulWidget {
  final String src;
  final UserInfo userInfo;
  final PetModel pet;
  final String? desc;

  const EditStoryDescSectionWidget({
    super.key,
    required this.src,
    required this.userInfo,
    required this.pet,
    this.desc,
  });

  @override
  State<EditStoryDescSectionWidget> createState() => _EditStoryDescSectionWidgetState();
}

class _EditStoryDescSectionWidgetState extends State<EditStoryDescSectionWidget> {
  String? writenDesc;

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
          const SizedBox(height: 20.0),

          EditStoryDescPostButton(
            onTap: () {
              // Post the story
            },
          )
        ],
      ),
    );
  }
}