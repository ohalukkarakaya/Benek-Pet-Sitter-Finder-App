import 'dart:convert';

import 'package:benek_kulube/common/constants/benek_icons.dart';
import 'package:benek_kulube/data/models/kulube_login_qr_code_model.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:benek_kulube/store/app_redux_store.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:flutter/material.dart';
import 'package:redux/redux.dart';

import '../../../../common/constants/app_colors.dart';
import '../../../../common/utils/client_id.dart';
import '../benek_dashed_border/benek_dashed_border.dart';
import '../benek_process_indicator/benek_process_indicator.dart';

class KulubeLoginQrCode extends StatefulWidget {
  const KulubeLoginQrCode({super.key});

  @override
  State<KulubeLoginQrCode> createState() => _KulubeLoginQrCodeState();
}

class _KulubeLoginQrCodeState extends State<KulubeLoginQrCode> {
  Store<AppState> store = AppReduxStore.currentStore!;
  @override
  Widget build(BuildContext context) {

    return Container(
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
                  child: store.state.loginQrCodeData.qrCode == ''

                    ? const Center(
                      child: BenekProcessIndicator(
                          color: Colors.black,
                          width: 50,
                          height: 50,
                        ),
                    )
                    
                    : store.state.loginQrCodeData.expireTime != null 
                    && !( store.state.loginQrCodeData.expireTime!.isBefore(DateTime.now()) )
                        ? Image.memory(
                            base64Decode(store.state.loginQrCodeData.qrCode),
                            gaplessPlayback: true,
                            fit: BoxFit.cover,
                          )
                        : Center(
                          child: IconButton(
                            icon: const Icon(BenekIcons.refreshdoublearrow, color: Colors.black), 
                            onPressed: () async {
                              KulubeLoginQrCodeModel resetQrCodeData = KulubeLoginQrCodeModel(
                                qrCode: "",
                                clientId: "",
                                expireTime: null
                              );

                              await store.dispatch(GetAdminLoginQrCodeAction(resetQrCodeData));
                              String clientId = await getClientId();
                              await store.dispatch(getAdminLoginQrCodeAction(clientId));
                            },
                            
                          ),
                        ),

                ),
              ),
            )
          );
  }
}