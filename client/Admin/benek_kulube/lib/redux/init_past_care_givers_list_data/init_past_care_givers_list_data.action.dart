// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek_kulube/common/utils/state_utils/auth_utils/auth_utils.dart';
import 'package:benek_kulube/data/models/pet_models/pet_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:benek_kulube/data/services/api.dart';
import 'package:benek_kulube/data/services/api_exception.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import '../../data/models/user_profile_models/user_past_care_givers_model.dart';

ThunkAction<AppState> initPastCareGiversAction(){
  return (Store<AppState> store) async {
    LightWeightUserInfoByUserIdListApi careGiversApi = LightWeightUserInfoByUserIdListApi();
    PetApi petApi = PetApi();

    try {
      if(
          store.state.selectedUserInfo == null
          || store.state.selectedUserInfo!.pastCaregivers == null
          || store.state.selectedUserInfo!.pastCaregivers!.isEmpty
          || store.state.selectedUserInfo!.pastCaregivers![0].careGiver is! String
          || store.state.selectedUserInfo!.pastCaregivers![0].pet is! String
      ){
        return;
      }

      UserInfo selectedUser = store.state.selectedUserInfo!;
      List<UserPastCaregivers> pastCareGiversList = selectedUser.pastCaregivers!;

      List<String> careGiverIdies = pastCareGiversList.map((item) => item.careGiver as String).toSet().toList();

      List<UserInfo?> _careGiverListdata = await careGiversApi.getLightWeightUserInfoByUserIdListRequest( careGiverIdies );

      for( UserPastCaregivers pastCareGiver in pastCareGiversList ){
        UserInfo defaultCareGiver = UserInfo();
        UserInfo? slectedCareGiver = _careGiverListdata.firstWhere(
            (careGiver) =>
                  careGiver!.userId == pastCareGiver.careGiver,
                  orElse: () => defaultCareGiver
        );

        if( slectedCareGiver != null && slectedCareGiver.userId != null ) {
          pastCareGiver.initCareGiver(slectedCareGiver);
        }

        PetModel defaultPet = PetModel();
        if(
          store.state.selectedUserInfo!.pets != null
          && store.state.selectedUserInfo!.pets!.isNotEmpty
          && store.state.selectedUserInfo!.pets![0] is PetModel
          && (
              store.state.selectedUserInfo!.pets!.firstWhere((pet) => pet.id == pastCareGiver.pet, orElse: () => defaultPet) != null
              && store.state.selectedUserInfo!.pets!.firstWhere((pet) => pet.id == pastCareGiver.pet, orElse: () => defaultPet).id != null
          )
        ){
          PetModel selectedPet = store.state.selectedUserInfo!.pets!.firstWhere((pet) => pet.id == pastCareGiver.pet);
          pastCareGiver.initPet( selectedPet );
        }else{
          PetModel? pet = await petApi.getPetByIdRequest( pastCareGiver.pet );
          pastCareGiver.initPet( pet! );
        }
      }

      store.dispatch(InitPastCareGiversAction(pastCareGiversList));

    } on ApiException catch (e) {
      log('ERROR: getLightWeightUserInfoByUserIdListAction - $e');
      // await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

class  InitPastCareGiversAction{
  final List<UserPastCaregivers>? _data;
  List<UserPastCaregivers>? get pastCareGiversList => _data;
  InitPastCareGiversAction(this._data);
}