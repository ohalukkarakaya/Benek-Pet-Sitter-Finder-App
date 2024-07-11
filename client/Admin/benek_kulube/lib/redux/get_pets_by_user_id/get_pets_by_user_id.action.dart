// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek_kulube/data/services/api.dart';
import 'package:benek_kulube/data/services/api_exception.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import '../../data/models/pet_models/pet_model.dart';

ThunkAction<AppState> getPetsByUserIdRequestAction( String? userId ) {
  return (Store<AppState> store) async {
    PetApi api = PetApi();

    if( userId == null ){
      return;
    }

    try {
      List<PetModel>? _pets = await api.getPetsByUserIdRequest( userId );

      await store.dispatch(GetPetsByUserIdRequestAction(_pets));
    } on ApiException catch (e) {
      log('ERROR: getPetsByUserIdRequestAction - $e');
      // await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

class GetPetsByUserIdRequestAction {
  final List<PetModel>? _pets;
  List<PetModel>? get pets => _pets;
  GetPetsByUserIdRequestAction(this._pets);
}