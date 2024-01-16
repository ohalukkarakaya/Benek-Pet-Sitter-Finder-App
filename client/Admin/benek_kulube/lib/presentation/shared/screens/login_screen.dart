import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:redux/redux.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

import '../../../common/constants/app_config.dart';
import '../../../common/utils/client_id.dart';
import '../../../common/utils/state_utils/auth_utils/auth_utils.dart';
import '../../../common/utils/state_utils/login_qr_code_utils/login_qr_code_utils.dart';
import '../../../data/models/kulube_login_qr_code_model.dart';
import '../../../store/actions/app_actions.dart';
import '../../../store/app_state.dart';
import '../components/login_qr_code/kulube_login_qr_code.dart';


Future<void> getQrCodeAndInitilize( Store<AppState> store ) async {
  String clientId = await getClientId();
  await getLoginQrCode( store, clientId );
}

class LoginScreen extends StatefulWidget {

  final Store<AppState> store;
  const LoginScreen({super.key, required this.store});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  late io.Socket socket;

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
      await getQrCodeAndInitilize(widget.store);
      
      socket.emit('addAdminClient',  widget.store.state.loginQrCodeData.clientId);
    });

    socket.on('getUserInfo', (data) async {
        KulubeLoginQrCodeModel resetQrCodeData = KulubeLoginQrCodeModel( qrCode: "", clientId: "", expireTime: null );
        await widget.store.dispatch(SetLoginCodeAction(resetQrCodeData));
        log('getUserInfo event received: $data');

        SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.setString('refreshToken', data['refreshToken']);

        socket.disconnect();

        AuthUtils.setCredentials( widget.store );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Row(
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
                  const Row(
                    children: [
                      Text(
                        "Kulübe",
                        style: TextStyle(
                          fontFamily: 'Qanelas',
                          fontSize: 40.0,
                          fontWeight: FontWeight.w400
                        ),
                      ),
                      Text(
                        "'ye Hoş Geldin",
                        style: TextStyle(
                          fontFamily: 'Qanelas',
                          fontSize: 40.0,
                          fontWeight: FontWeight.w100
                        ),
                      ),
                    ],
                  ),
              
                  const SizedBox(height: 10.0),
        
                  const Text(
                    "Giriş yapmak için aşağıdaki kodu Benek uygulamasına okut.",
                    style: TextStyle(
                      fontFamily: 'Qanelas',
                      fontSize: 15.0,
                      fontWeight: FontWeight.w400
                    ),
                  ),
        
                  const SizedBox(height: 40.0),
              
                  KulubeLoginQrCode( store: widget.store ),
        
                  const SizedBox(height: 40.0),
        
                  Text(
                    widget.store.state.loginQrCodeData.expireTime == null 
                    || widget.store.state.loginQrCodeData.expireTime!.isBefore(DateTime.now()) 
                      ? "Yeni bi QR kod almak için butona tıkla :)"
                      : "Bu kodun süresi, bir saat içinde dolar!",
                    style: const TextStyle(
                      fontFamily: 'Qanelas',
                      fontSize: 12.0,
                      fontWeight: FontWeight.w400
                    ),
                  ),
                ],
              ),
              const Text(
                    "Bu platform Benek çalışanları içindir! Eğer değilsen, lütfen uygulamayı sil!",
                    style: TextStyle(
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
    );
  }
}