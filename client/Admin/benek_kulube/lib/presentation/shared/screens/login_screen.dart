import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/shared_preferences_helper.dart';
import 'package:benek_kulube/store/app_redux_store.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:flutter/material.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

import '../../../common/constants/app_config.dart';
import '../../../common/utils/client_id.dart';
import '../../../common/utils/state_utils/auth_utils/auth_utils.dart';
import '../../../data/models/kulube_login_qr_code_model.dart';
import '../../../store/actions/app_actions.dart';
import '../components/login_qr_code/kulube_login_qr_code.dart';


Future<void> getQrCodeAndInitilize( Store<AppState> store ) async {
  String clientId = await getClientId();
  await store.dispatch(getAdminLoginQrCodeAction( clientId ));
}

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  late io.Socket socket;

  Store<AppState> store = AppReduxStore.currentStore!;

  @override
  void initState() {
    super.initState();

    socket = io.io(
      AppConfig.socketServerBaseUrl, 
      <String, dynamic>{
        'transports': ['websocket'],
        'autoConnect': false,
      }
    );

    socket.connect();

    Future.delayed(Duration.zero, () async {
      await getQrCodeAndInitilize( store );
      socket.emit('addAdminClient',  store.state.loginQrCodeData.clientId);
    });

    socket.on('getUserInfo', (data) async {
        KulubeLoginQrCodeModel resetQrCodeData = KulubeLoginQrCodeModel( qrCode: "", clientId: "", expireTime: null );
        await store.dispatch(GetAdminLoginQrCodeAction(resetQrCodeData));

        SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.setString(SharedPreferencesKeys.refreshToken, data['refreshToken']);

        socket.disconnect();

        AuthUtils.setCredentials();
    });
  }

  @override
  Widget build(BuildContext context) {

    int appNameIndex = BenekStringHelpers.locale('welcomeMessage').indexOf(
        BenekStringHelpers.locale('appName')
    );

    return Padding(
      padding: const EdgeInsets.only(top: 45.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Padding(
            padding: const EdgeInsets.all(50.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                     RichText(
                         text: TextSpan(
                           children: [
                             TextSpan(
                               text: BenekStringHelpers.locale('welcomeMessage').substring(0, appNameIndex),
                               style: const TextStyle(
                                   fontFamily: 'Qanelas',
                                   fontSize: 40.0,
                                   fontWeight: FontWeight.w100
                               ),
                             ),
                             TextSpan(
                               text: BenekStringHelpers.locale('appName'),
                               style: const TextStyle(
                                 fontFamily: 'Qanelas',
                                 fontSize: 40.0,
                                 fontWeight: FontWeight.w400
                               ),
                             ),
                             TextSpan(
                               text: BenekStringHelpers.locale('welcomeMessage').substring(
                                 appNameIndex + BenekStringHelpers.locale('appname').length
                               ),
                               style: const TextStyle(
                                 fontFamily: 'Qanelas',
                                 fontSize: 40.0,
                                 fontWeight: FontWeight.w100
                               ),
                             ),
                           ]
                         )
                     ),

                    const SizedBox(height: 10.0),

                    Text(
                      BenekStringHelpers.locale('qrCodeDescription'),
                      style: const TextStyle(
                        fontFamily: 'Qanelas',
                        fontSize: 15.0,
                        fontWeight: FontWeight.w400
                      ),
                    ),

                    const SizedBox(height: 40.0),

                    KulubeLoginQrCode( store: store),

                    const SizedBox(height: 40.0),

                    Text(
                      store.state.loginQrCodeData.expireTime == null
                      || store.state.loginQrCodeData.expireTime!.isBefore(DateTime.now())
                        ? BenekStringHelpers.locale('toGetNewQrCode')
                        : BenekStringHelpers.locale("qrCodeExpireTime"),
                      style: const TextStyle(
                        fontFamily: 'Qanelas',
                        fontSize: 12.0,
                        fontWeight: FontWeight.w400
                      ),
                    ),
                  ],
                ),
                Text(
                      BenekStringHelpers.locale("welcomeScreenWarning"),
                      style: const TextStyle(
                        fontFamily: 'Qanelas',
                        fontSize: 12.0,
                        fontWeight: FontWeight.w200
                      ),
                    ),
              ],
            ),
          ),
          Column(
            mainAxisAlignment: MainAxisAlignment.end,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Image.asset(
                'assets/images/login_screen_kulube.png',
                width: 600,
              ),
            ],
          ),
        ],
      ),
    );
  }
}