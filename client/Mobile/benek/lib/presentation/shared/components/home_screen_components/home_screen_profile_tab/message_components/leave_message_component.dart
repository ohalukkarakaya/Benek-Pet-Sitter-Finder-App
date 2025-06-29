import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:benek/data/models/user_profile_models/user_info_model.dart';
import 'package:benek/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:benek/presentation/shared/components/benek_process_indicator/benek_process_indicator.dart';
import 'package:benek/store/actions/app_actions.dart';
import 'package:benek/store/app_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';

class LeaveMessageComponent extends StatefulWidget {
  final String chatId;

  const LeaveMessageComponent({super.key, required this.chatId});

  @override
  State<LeaveMessageComponent> createState() => _LeaveMessageComponentState();
}

class _LeaveMessageComponentState extends State<LeaveMessageComponent> {
  late final FocusScopeNode _focusScopeNode;
  late final FocusNode _textFocusNode;
  late final TextEditingController _textController;

  bool isButtonHovered = false;
  bool isFocused = false;
  bool isSendingRequest = false;

  @override
  void initState() {
    super.initState();
    _focusScopeNode = FocusScopeNode();
    _textFocusNode = FocusNode();
    _textController = TextEditingController();
    _textFocusNode.addListener(() {
      setState(() => isFocused = _textFocusNode.hasFocus);
    });
  }

  @override
  void dispose() {
    _focusScopeNode.dispose();
    _textFocusNode.dispose();
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final store = StoreProvider.of<AppState>(context);
    final UserInfo userInfo = store.state.userInfo!;
    final isReadyToSend = _textController.text.trim().isNotEmpty && isButtonHovered;

    return SizedBox(
        width: double.infinity,
        height: 90.0,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Expanded(
              flex: 8,
              child: Container(
                decoration: BoxDecoration(
                  color: isFocused ? AppColors.benekLightBlue : AppColors.benekBlack,
                  borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(top: 8.0),
                      child: BenekCircleAvatar(
                        isDefaultAvatar: userInfo.profileImg!.isDefaultImg!,
                        imageUrl: userInfo.profileImg!.imgUrl!,
                        width: 30.0,
                        height: 30.0,
                        borderWidth: 2.0,
                        bgColor: isFocused ? AppColors.benekBlack : AppColors.benekWhite,
                      ),
                    ),

                    const SizedBox(width: 8),

                    Expanded(
                      child: SizedBox(
                        height: 48.0,
                        child: ScrollConfiguration(
                          behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
                          child: SingleChildScrollView(
                            physics: const BouncingScrollPhysics(),
                            child: FocusScope(
                              node: _focusScopeNode,
                              child: TextFormField(
                                focusNode: _textFocusNode,
                                controller: _textController,
                                maxLength: 200,
                                onChanged: (value) {
                                  setState(() {});
                                },
                                maxLines: null,
                                keyboardType: TextInputType.multiline,
                                cursorColor: isFocused ? AppColors.benekBlack : AppColors.benekWhite,
                                style: lightTextStyle( textColor: isFocused ? AppColors.benekBlack : AppColors.benekWhite ),
                                textAlignVertical: TextAlignVertical.top,
                                decoration: InputDecoration(
                                  counterText: '',
                                  hintText: BenekStringHelpers.locale('writeAMessage'),
                                  hintStyle: isFocused ? lightTextStyle( textColor: AppColors.benekGrey ) : null,
                                  contentPadding: EdgeInsets.zero,
                                  border: InputBorder.none,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(width: 8),

            Expanded(
              flex: 2,
              child: MouseRegion(
                cursor: isReadyToSend
                    && !isSendingRequest
                    ? SystemMouseCursors.click
                    : SystemMouseCursors.move,
                onHover: (_) {
                  setState(() {
                    isButtonHovered = true;
                  });
                },
                onExit: (_) {
                  setState(() {
                    isButtonHovered = false;
                  });
                },
                child: Container(
                    height: 80.0,
                    padding: const EdgeInsets.symmetric(horizontal: 30.0, vertical: 30.0),
                    decoration: BoxDecoration(
                      color: isReadyToSend
                          && !isSendingRequest
                          ? AppColors.benekLightBlue
                          : AppColors.benekBlack,
                      borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
                    ),
                    child: GestureDetector(
                        onTap: isReadyToSend
                            && !isSendingRequest
                            ? () async {
                              setState(() {
                                isSendingRequest = true;
                              });
                              await store.dispatch(sendMessageAction( widget.chatId, _textController.text.trim() ));
                              setState(() {
                                _textController.clear();;
                                isSendingRequest = false;
                              });
                            }
                            : null,
                        child: !isSendingRequest
                            ? Icon(
                              Icons.send,
                              color: isReadyToSend
                                  ? AppColors.benekBlack
                                  : AppColors.benekWhite,
                              size: 20,
                            )
                            : const BenekProcessIndicator(
                          width: 3.0,
                          height: 3.0,
                        )
                    )
                ),
              ),
            ),
          ],
        )
    );
  }
}