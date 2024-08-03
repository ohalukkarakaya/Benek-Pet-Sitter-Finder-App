import 'package:benek_kulube/common/widgets/vertical_video_companent/vertical_video_widget.dart';
import 'package:benek_kulube/data/models/pet_models/pet_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import '../../../../../loading_components/benek_blured_modal_barier.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/app_state.dart';

import 'edit_story_desc_section.dart';

class CreateStoryScreen extends StatefulWidget {
  final String src;
  final PetModel pet;

  const CreateStoryScreen({
    super.key,
    required this.src,
    required this.pet
  });

  @override
  State<CreateStoryScreen> createState() => _CreateStoryScreenState();
}

class _CreateStoryScreenState extends State<CreateStoryScreen> {
  final FocusNode _createStoryFocusNode = FocusNode();

  bool shouldPop = false;

  @override
  void initState() {
    super.initState();
    _createStoryFocusNode.requestFocus();
  }

  @override
  Widget build(BuildContext context) {

    final Store<AppState> store = StoreProvider.of<AppState>(context);

    if( shouldPop ){
      setState(() {
        shouldPop = false;
      });
      Navigator.pop(context);
    }

    return BenekBluredModalBarier(
      isDismissible: false,
      child: KeyboardListener(
        focusNode: _createStoryFocusNode,
        onKeyEvent: (KeyEvent event){
          if(
              event is KeyDownEvent
              && event.logicalKey == LogicalKeyboardKey.escape
          ){
            setState(() {
              shouldPop = true;
            });
          }
        },
        child: Scaffold(
          backgroundColor: Colors.transparent,
          body: Padding(
            padding: const EdgeInsets.only(right: 40.0),
            child: Center(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(right: 40.0),
                    child: SizedBox(
                      height: MediaQuery.of(context).size.height - 100,
                      width: MediaQuery.of(context).size.width / 3,
                      child: VerticalContentComponent(
                        isLocalAsset: true,
                        src: widget.src,
                        user: store.state.selectedUserInfo!,
                        width: MediaQuery.of(context).size.width / 3,
                        height: MediaQuery.of(context).size.height - 100,
                        isCreatingStory: true,
                      ),
                    ),
                  ),

                  EditStoryDescSectionWidget(
                    src: widget.src,
                    userInfo: store.state.selectedUserInfo!,
                    pet: widget.pet,
                    desc: null,
                    closeFunction: () => setState(() {
                      shouldPop = true;
                    })
                  )
                ],
              )
            ),
          )
        ),
      ),
    );
  }
}
