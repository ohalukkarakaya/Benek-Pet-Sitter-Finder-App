// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek/data/models/pet_models/pet_model.dart';
import 'package:benek/data/services/api.dart';
import 'package:benek/data/services/api_exception.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

ThunkAction<AppState> getRecommendedPetsRequestAction() {
  return (Store<AppState> store) async {
    RecommendedPetsApi api = RecommendedPetsApi();

    try {
      List<PetModel> _dataList = await api.getRecommendedPetsRequest();

      await store.dispatch(GetRecommendedPetsRequestAction(_dataList));

    } on ApiException catch (e) {
      log('ERROR: getRecommendedPetsRequestAction - $e');
      // await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

class GetRecommendedPetsRequestAction {
  final List<PetModel>? _dataList;
  List<PetModel>? get dataList => _dataList;
  GetRecommendedPetsRequestAction(this._dataList);
}