import 'package:benek_kulube/data/models/pet_models/pet_model.dart';

import 'package:benek_kulube/store/actions/app_actions.dart';

PetModel? SetSelectedPetReducer( PetModel? state, dynamic action ){
  if( action is GetPetByIdRequestAction ){
    return action.pet;
  }else if( action is SetSelectedPetAction ){
    return action.pet;
  }else if( action is GetPetPhotosByIdRequestAction ){
    state!.images = action.petImages;
    return state;
  }
  return state;
}