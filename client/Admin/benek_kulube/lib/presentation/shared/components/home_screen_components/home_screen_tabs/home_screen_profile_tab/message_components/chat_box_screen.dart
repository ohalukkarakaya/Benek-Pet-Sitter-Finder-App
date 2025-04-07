import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

import 'package:benek_kulube/store/app_state.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';

import '../../../../../../../common/constants/app_config.dart';
import '../../../../../../../data/models/chat_models/chat_model.dart';
import '../../../../../../../data/models/chat_models/message_seen_data_model.dart';
import '../../../../../../../data/models/user_profile_models/user_info_model.dart';

import '../../../../loading_components/benek_blured_modal_barier.dart';
import 'chat_list_widget.dart';

class ChatBoxScreen extends StatefulWidget {
  const ChatBoxScreen({super.key});

  @override
  State<ChatBoxScreen> createState() => _ChatBoxScreenState();
}

class _ChatBoxScreenState extends State<ChatBoxScreen> {
  io.Socket? socket;
  bool didRequestSend = false;
  bool isChatLoading = true;

  // fill it if a chat moves
  String? oldChatId;
  String? movedChatId;

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

      if( store.state.userInfo != null && store.state.selectedUserInfo != null ){
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

      socket.on('chatMemberLeaved', (data) async {
        await store.dispatch(userLeftActionFromSocket( data ));
      });

      // Listen for incoming message reads
      socket.on('seenMessage', (data) async {
        MessageSeenData receivingSeenData = MessageSeenData.fromJson(data);
        receivingSeenData.chatOwnerId = store.state.selectedUserInfo!.userId;

        await store.dispatch(seenMessageAsAdminBySocketAction(receivingSeenData));
      });
    });

  }

  @override
  Widget build(BuildContext context) {
    return BenekBluredModalBarier(
      isDismissible: true,
      onDismiss: () => Navigator.of(context).pop(),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Padding(
          padding: const EdgeInsets.only(right: 50.0),
          child: Center(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                SizedBox(
                  height: MediaQuery.of(context).size.height - 150,
                  width: MediaQuery.of(context).size.width - 150,
                  child: ChatListWidget(),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
