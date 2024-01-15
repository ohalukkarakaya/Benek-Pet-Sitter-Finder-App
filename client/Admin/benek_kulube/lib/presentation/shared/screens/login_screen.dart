import 'package:flutter/material.dart';
import 'package:redux/redux.dart';

import '../../../common/utils/client_id.dart';
import '../../../common/utils/state_utils/login_qr_code_utils/login_qr_code.dart';
import '../../../store/app_state.dart';


Future<void> getQrCodeAndInitilize( Store<AppState> store ) async {
  String clientId = await getClientId();
  await getLoginQrCode( store, clientId );
}

class LoginScreen extends StatefulWidget {
  final Store<AppState> store;
  
  LoginScreen({super.key, required this.store});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  @override
  void initState() async {
    super.initState();
    await getQrCodeAndInitilize( widget.store );
  }

  @override
  Widget build(BuildContext context) {
    widget.store.state.loginQrCodeData.qrCode != ''
        ? 
        : Navigator.pushNamed(context, '/login');

    return const Placeholder();
  }
}