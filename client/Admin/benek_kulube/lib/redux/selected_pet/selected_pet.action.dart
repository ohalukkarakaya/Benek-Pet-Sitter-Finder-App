// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek_kulube/data/services/api.dart';
import 'package:benek_kulube/data/services/api_exception.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import '../../data/models/pet_models/pet_model.dart';

ThunkAction<AppState> getPetByIdRequestAction( String? petId ) {
  return (Store<AppState> store) async {
    PetApi api = PetApi();

    if( petId == null ){
      return;
    }

    try {
      PetModel? _pet = await api.getPetByIdRequest( petId );

      await store.dispatch(GetPetByIdRequestAction(_pet));
    } on ApiException catch (e) {
      log('ERROR: GetPetByIdRequestAction - $e');
      // await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

ThunkAction<AppState> setSelectedPetAction( PetModel? pet ) {
  return (Store<AppState> store) async {
    try {

      await store.dispatch(SetSelectedPetAction(pet));
    } on ApiException catch (e) {
      log('ERROR: GetPetByIdRequestAction - $e');
      // await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

class GetPetByIdRequestAction {
  final PetModel? _pet;
  PetModel? get pet => _pet;
  GetPetByIdRequestAction(this._pet);
}

class SetSelectedPetAction {
  final PetModel? _pet;
  PetModel? get pet => _pet;
  SetSelectedPetAction(this._pet);
}