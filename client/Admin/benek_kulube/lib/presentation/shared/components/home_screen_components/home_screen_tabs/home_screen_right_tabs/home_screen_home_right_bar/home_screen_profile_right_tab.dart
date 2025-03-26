import 'dart:developer';

import 'package:benek_kulube/data/models/chat_models/chat_model.dart';
import 'package:benek_kulube/presentation/features/user_profile_helpers/auth_role_helper.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/user_id_log_preview_components/user_id_log_preview_component.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

import 'package:benek_kulube/store/app_state.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';

import '../../../../../../../common/constants/app_config.dart';
import '../../../../../../../data/models/chat_models/message_seen_data_model.dart';
import '../../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../../../../benek_circle_avatar/benek_circle_avatar.dart';
import '../../home_screen_profile_tab/message_components/chat_preview_component.dart';
import '../../home_screen_profile_tab/profile_screen_section_components/pet_profile_turn_back_to_selected_user_button.dart';
import '../../home_screen_profile_tab/profile_screen_section_components/punishment_count_widget.dart';

class HomeScreenProfileRightTab extends StatefulWidget {
  const HomeScreenProfileRightTab({super.key});

  @override
  State<HomeScreenProfileRightTab> createState() => _HomeScreenProfileRightTabState();
}

class _HomeScreenProfileRightTabState extends State<HomeScreenProfileRightTab> {
  io.Socket? socket;

  bool didRequestSend = false;
  bool isLogsLoading = true;
  bool isChatLoading = true;

  @override
  void initState() {
    super.initState();

    var socket = io.io(
        AppConfig.socketServerBaseUrl,
        <String, dynamic>{
          'transports': ['websocket'],
          'autoConnect': false,
        }
    );

    // Connect to web socket
    socket.connect();

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      Store<AppState> store = StoreProvider.of<AppState>(context);
      if( !didRequestSend ){

        await store.dispatch(IncreaseProcessCounterAction());

        didRequestSend = true;

        // Moderator Operations Auth Check
        if(
          AuthRoleHelper.checkIfRequiredRole( store.state.userRoleId, [ AuthRoleHelper.getAuthRoleIdFromRoleName('superAdmin'), AuthRoleHelper.getAuthRoleIdFromRoleName('moderator')])
          && store.state.selectedUserInfo != null
          && store.state.selectedUserInfo!.userId != null
          && store.state.selectedPet == null
        ){
         // Moderator Operations

         // Send Get request as first step to pull existing chat data
         await store.dispatch(getUsersChatAsAdminRequestAction(store.state.selectedUserInfo!.userId!, null));
         isChatLoading = false;

         // Let User Know That You Are Here
         if(
          store.state.userInfo != null
          && store.state.selectedUserInfo != null
         ){
           Future.delayed(Duration.zero, () async {
             socket.emit(
                 'addEvaluatorToChat',
                 [
                   store.state.userInfo!.userId,
                   store.state.selectedUserInfo!.userId!
                 ]
             );
           });
         }


         // Listen for incoming messages
         socket.on('getMessage', (data) async {
           ChatModel receivingChatData = ChatModel.fromJson(data);
           await store.dispatch(getUsersChatAsAdminRequestActionFromSocket(receivingChatData, store.state.selectedUserInfo!.userId!));
         });

         // Listen for incoming message reads
         socket.on('seenMessage', (data) async {
           MessageSeenData receivingSeenData = MessageSeenData.fromJson(data);
           receivingSeenData.chatOwnerId = store.state.selectedUserInfo!.userId;

           await store.dispatch(seenMessageAsAdminBySocketAction(receivingSeenData));
         });

         // Send Get Request to pull punishment count of the user
         await store.dispatch(getUsersPunishmentCountRequestAction(store.state.selectedUserInfo!.userId!));
        }

        // Developer Operations Auth Check
        if(
          AuthRoleHelper.checkIfRequiredRole(store.state.userRoleId, [ AuthRoleHelper.getAuthRoleIdFromRoleName('superAdmin'), AuthRoleHelper.getAuthRoleIdFromRoleName('developer')])
          && store.state.selectedUserInfo != null
          && store.state.selectedUserInfo!.userId != null
          && store.state.selectedPet == null
        ){
          // Developer Operations

          // Send Get Request to pull log records of the user
          await store.dispatch(getLogsByUserIdRequestAction(store.state.selectedUserInfo!.userId!));
          isLogsLoading = false;
        }

        await store.dispatch(DecreaseProcessCounterAction());
      }
    });
  }

  @override
  void dispose() {
    super.dispose();
    socket?.disconnect();
  }

  @override
  Widget build(BuildContext context){
    return StoreConnector<AppState, UserInfo?>(
      converter: (store) => store.state.selectedUserInfo,
      builder: (BuildContext context, UserInfo? selectedUserInfo){
        var store = StoreProvider.of<AppState>( context );

        return Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: SizedBox(
                width: 350,
                child: ScrollConfiguration(
                  behavior: ScrollConfiguration.of(context).copyWith(
                    scrollbars: false,
                    overscroll: false,
                    physics: const BouncingScrollPhysics(),
                  ),
                  child: ListView(
                    shrinkWrap: true,
                    physics: store.state.selectedUserInfo == null
                        ? const NeverScrollableScrollPhysics()
                        : const BouncingScrollPhysics(),
                    children: [
              
                      Padding(
                          padding: const EdgeInsets.only(
                              right: 40.0,
                              top: 50.0,
                              bottom: 70.0
                          ),
                          child: Center(
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                BenekCircleAvatar(
                                  width: 50,
                                  height: 50,
                                  radius: 100,
                                  isDefaultAvatar: store.state.userInfo!.profileImg!.isDefaultImg!,
                                  imageUrl: store.state.userInfo!.profileImg!.imgUrl!,
                                ),
                              ],
                            ),
                          )
                      ),

                      selectedUserInfo != null
                      && AuthRoleHelper.checkIfRequiredRole(store.state.userRoleId, [ AuthRoleHelper.getAuthRoleIdFromRoleName('superAdmin'), AuthRoleHelper.getAuthRoleIdFromRoleName('moderator')])
                      && store.state.selectedPet == null
                        ? PunishmentCountWidget()
                          : store.state.selectedPet != null
                            ? PetProfileTurnBackToSelectedUserButton()
                            : const SizedBox(),
              
                      selectedUserInfo != null
                      && AuthRoleHelper.checkIfRequiredRole(store.state.userRoleId, [ AuthRoleHelper.getAuthRoleIdFromRoleName('superAdmin'), AuthRoleHelper.getAuthRoleIdFromRoleName('moderator')])
                      && store.state.selectedPet == null
                          ? ChatPreviewWidget(
                          chatOwnerUserId: selectedUserInfo.userId!,
                          chatInfo: selectedUserInfo.chatData,
                          isLoading: isChatLoading,
                        )
                        : const SizedBox(),
              
                      selectedUserInfo != null
                      && AuthRoleHelper.checkIfRequiredRole(store.state.userRoleId, [ AuthRoleHelper.getAuthRoleIdFromRoleName('superAdmin'), AuthRoleHelper.getAuthRoleIdFromRoleName('developer')])
                      && store.state.selectedPet == null
                          ? UserIdLogPreviewComponent(
                          isLoading: isLogsLoading,
                          logData: selectedUserInfo.logs,
                        )
                        : const SizedBox(),
                    ],
                  ),
                ),
              ),
            )
          ],
        );
      }
    );
  }
}
