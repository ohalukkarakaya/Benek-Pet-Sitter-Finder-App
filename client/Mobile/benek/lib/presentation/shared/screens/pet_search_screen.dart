import 'package:benek/data/models/pet_models/pet_model.dart';
import 'package:benek/presentation/shared/components/pet_search_components/pet_search_bar.dart';
import 'package:benek/presentation/shared/components/pet_search_components/pet_search_result_list/pet_search_result_list.dart';

import 'package:benek/store/actions/app_actions.dart';
import 'package:benek/store/app_redux_store.dart';
import 'package:benek/store/app_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import '../components/loading_components/benek_blured_modal_barier.dart';
import '../components/loading_components/benek_loading_component.dart';

class KulubePetSearchScreen extends StatefulWidget {
  const KulubePetSearchScreen({super.key});

  @override
  State<KulubePetSearchScreen> createState() => _KulubePetSearchScreenState();
}

class _KulubePetSearchScreenState extends State<KulubePetSearchScreen> {
  bool shouldPop = false;
  bool didRequestDone = false;
  PetModel? hoveringPet;
  final FocusNode _focusNode = FocusNode();

  Function()? _onPetHoverCallback(PetModel pet){
    setState(() {
      hoveringPet = pet;
    });
    return null;
  }

  Function()? _onPetHoverExitCallback(){
    setState(() {
      hoveringPet = null;
    });
    return null;
  }

  Future<void> getRecommendedPetsRequestAsync(Function callback) async {
    Store<AppState> store = AppReduxStore.currentStore!;
    await store.dispatch(getRecommendedPetsRequestAction());
    if( mounted ){
      callback();
    }
  }

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(_onFocusChanged);

    getRecommendedPetsRequestAsync(
        (){
          setState(() {
            didRequestDone = true;
          });
        }
    );
  }

  void _onFocusChanged(){
    if (!_focusNode.hasFocus){
      setState(() {
        shouldPop = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {

    final Store<AppState> store = StoreProvider.of<AppState>(context);

    if( shouldPop ){
      setState(() {
        shouldPop = false;
      });

      if( hoveringPet != null ){
        Navigator.pop(context, hoveringPet);
      }else{
        Navigator.pop(context);
      }
    }
    return BenekBluredModalBarier(
      isDismissible: true,
      onDismiss: () async {
        Navigator.pop(context);
      },
      child: KeyboardListener(
        focusNode: _focusNode,
        child: Scaffold(
            backgroundColor: Colors.transparent,
            body: Padding(
                padding: const EdgeInsets.only( right: 250.0, left: 250.0, top: 30.0),
                child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      const PetSearchBarTextFieldWidget(),
                      const SizedBox(height: 16.0),
                      (
                          (
                              store.state.petSearchResultList != null
                              && store.state.petSearchResultList!.pets != null
                              && store.state.petSearchResultList!.pets!.isNotEmpty
                          )
                          || (
                            store.state.userInfo!.recommendedPets != null
                            && store.state.userInfo!.recommendedPets!.isNotEmpty
                          )
                      )
                      ? PetSearchResultList(
                          store: store,
                          onPetHoverCallback: _onPetHoverCallback,
                          onPetHoverExitCallback: _onPetHoverExitCallback,
                        )
                      : const Expanded(
                        flex: 9,
                        child: Center(
                          child: BenekLoadingComponent(
                            isDark: true,
                            width: 140.0,
                            height: 140.0,
                          ),
                        ),
                      ),
                    ]
                )
            )
        )
      ),
    );
  }
}
