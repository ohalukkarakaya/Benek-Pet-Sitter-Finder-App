// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek_kulube/common/utils/get_current_location_helper.dart';
import 'package:benek_kulube/common/utils/state_utils/auth_utils/auth_utils.dart';
import 'package:benek_kulube/data/models/pet_models/pet_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_list_model.dart';
import 'package:benek_kulube/data/services/api.dart';
import 'package:benek_kulube/data/services/api_exception.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import '../../data/models/pet_models/pet_list_model.dart';

ThunkAction<AppState> petSearchRequestAction(String searchValue, bool isPagination) {
  return (Store<AppState> store) async {
    PetSearchApi api = PetSearchApi();

    try {

      String lastItemId = isPagination
          ? store.state.petSearchResultList!.pets!.last.id!
          : "null";

      PetListModel _searchListData = await api.getPetSearchRequest( lastItemId, searchValue );
      if( isPagination && store.state.petSearchResultList != null){
        store.state.petSearchResultList?.pets?.addAll( _searchListData.pets ?? [] );
        if( store.state.petSearchResultList?.pets != null ){
          Map<String, PetModel> petsMap = {};
          for (PetModel pet in store.state.petSearchResultList!.pets??[]) {
            if( null != pet.id ){
              petsMap[pet.id!] = pet;
            }
          }

          store.state.petSearchResultList!.pets!.clear();
          store.state.petSearchResultList!.pets!.addAll(petsMap.values);
        }

        _searchListData = store.state.petSearchResultList!;
      }
      await store.dispatch(PetSearchRequestAction(_searchListData));

    } on ApiException catch (e) {
      log('ERROR: petSearchRequestAction - $e');
      // await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

ThunkAction<AppState> resetPetSearchDataAction() {
  return (Store<AppState> store) async {
    try {
      await store.dispatch(PetSearchRequestAction(null));
    } on ApiException catch (e) {
      log('ERROR: resetPetSearchDataAction - $e');
      // await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

class PetSearchRequestAction {
  final PetListModel? _searchListData;
  PetListModel? get searchListData => _searchListData;
  PetSearchRequestAction(this._searchListData);
}