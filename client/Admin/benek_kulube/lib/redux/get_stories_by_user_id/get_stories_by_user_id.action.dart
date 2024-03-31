// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek_kulube/data/services/api.dart';
import 'package:benek_kulube/data/services/api_exception.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import '../../data/models/story_models/story_model.dart';

ThunkAction<AppState> getStoriesByUserIdRequestAction( String userId ) {
  return (Store<AppState> store) async {
    StoryApi api = StoryApi();

    try {
      List<StoryModel>? _stories = await api.getStoriesByUserIdRequest( userId );

      await store.dispatch(GetStoriesByUserIdRequestAction(_stories));
    } on ApiException catch (e) {
      log('ERROR: getStoriesByUserId - $e');
      // await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

class GetStoriesByUserIdRequestAction {
  final List<StoryModel>? _stories;
  List<StoryModel>? get stories => _stories;
  GetStoriesByUserIdRequestAction(this._stories);
}