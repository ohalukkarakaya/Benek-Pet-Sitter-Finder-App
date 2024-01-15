import 'dart:convert';

import 'package:benek_kulube/presentation/shared/components/benek_process_indicator/benek_process_indicator.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:redux/redux.dart';

import '../../../common/constants/app_colors.dart';
import '../../../common/utils/client_id.dart';
import '../../../common/utils/state_utils/login_qr_code_utils/login_qr_code.dart';
import '../../../store/app_state.dart';
import '../components/benek_dashed_border/benek_dashed_border.dart';


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

  @override
  void initState() {
    super.initState();
    
    Future.delayed(Duration.zero, () async {
      await getQrCodeAndInitilize(widget.store);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(50.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.end,
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
            "Giriş yapmak için aşağıdaki kodu Benek uygulamasıyla okut.",
            style: TextStyle(
              fontFamily: 'Qanelas',
              fontSize: 15.0,
              fontWeight: FontWeight.w400
            ),
          ),

          const SizedBox(height: 40.0),
      
          Container(
            width: 250,
            height: 250,
            decoration: const BoxDecoration(
              color: AppColors.benekLightBlue,
              borderRadius: BorderRadius.all( Radius.circular( 20.0 ) )
            ),
            padding: const EdgeInsets.all(10),
            child: BenekDottedBorder(
              color: Colors.black,
              strokeWidth: 1.5,
              borderType: BorderType.RRect,
              radius: const Radius.circular(15.0),
              padding: const EdgeInsets.all(6),
              child: ClipRRect(
                borderRadius: const BorderRadius.all(Radius.circular(15.0)),
                child: Container(
                  padding: const EdgeInsets.all(3.0),
                  child: widget.store.state.loginQrCodeData.qrCode == '' 
                    ? const Center(
                      child: BenekProcessIndicator(
                          color: Colors.black,
                          width: 50,
                          height: 50,
                        ),
                    )
                    : Image.memory(
                        base64Decode(widget.store.state.loginQrCodeData.qrCode),
                        gaplessPlayback: true,
                        fit: BoxFit.cover,
                      ),
                ),
              ),
            )
          ),

          const SizedBox(height: 40.0),

          const Text(
            "Bu kodun bir saat içinde süresi dolar!",
            style: TextStyle(
              fontFamily: 'Qanelas',
              fontSize: 12.0,
              fontWeight: FontWeight.w400
            ),
          ),
        ],
      ),
    );
  }
}