// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek/data/models/pet_models/pet_model.dart';
import 'package:benek/data/models/user_profile_models/user_care_giver_career_model.dart';
import 'package:benek/data/models/user_profile_models/user_info_model.dart';
import 'package:benek/data/services/api.dart';
import 'package:benek/data/services/api_exception.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';


ThunkAction<AppState> initCareGiveDataAction(){
  return (Store<AppState> store) async {
    PetApi petApi = PetApi();

    try {
      if(
          store.state.selectedUserInfo == null
          || store.state.selectedUserInfo!.caregiverCareer == null
          || store.state.selectedUserInfo!.caregiverCareer!.isEmpty
          || store.state.selectedUserInfo!.caregiverCareer![0].pet is! String
      ){
        return;
      }

      UserInfo selectedUser = store.state.selectedUserInfo!;
      List<UserCaregiverCareer> careGiveList = selectedUser.caregiverCareer!;

      for( UserCaregiverCareer careGive in careGiveList ){
        PetModel defaultPet = PetModel();
        if(
        store.state.selectedUserInfo!.pets != null
            && store.state.selectedUserInfo!.pets!.isNotEmpty
            && store.state.selectedUserInfo!.pets![0] is PetModel
            && (
              store.state.selectedUserInfo!.pets!.firstWhere((pet) => pet.id == careGive.pet, orElse: () => defaultPet) != null
              && store.state.selectedUserInfo!.pets!.firstWhere((pet) => pet.id == careGive.pet, orElse: () => defaultPet).id != null
            )
        ){
          PetModel selectedPet = store.state.selectedUserInfo!.pets!.firstWhere((pet) => pet.id == careGive.pet);
          careGive.initPet( selectedPet );
        }else{
          PetModel? pet = await petApi.getPetByIdRequest( careGive.pet );
          careGive.initPet( pet! );
        }
      }

      store.dispatch(InitCareGiveDataAction(careGiveList));

    } on ApiException catch (e) {
      log('ERROR: initCareGiveDataAction - $e');
      // await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

class  InitCareGiveDataAction{
  final List<UserCaregiverCareer>? _data;
  List<UserCaregiverCareer>? get careGiveList => _data;
  InitCareGiveDataAction(this._data);
}