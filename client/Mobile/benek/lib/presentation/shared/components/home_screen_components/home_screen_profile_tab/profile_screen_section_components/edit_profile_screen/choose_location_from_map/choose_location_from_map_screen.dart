import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/utils/benek_toast_helper.dart';
import 'package:benek/store/app_redux_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import '../../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../../common/constants/turkish_cities_data_list.dart';
import '../../../../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../../../../../../../../../data/services/api.dart';
import 'address_info_bar.dart';
import 'address_save_button.dart';
import 'location_warning_widget.dart';
import 'map_back_and_cancel_button.dart';

class ChooseLocationFromMapScreen extends StatefulWidget {
  final UserInfo? userInfo;
  const ChooseLocationFromMapScreen({
    super.key,
    this.userInfo,
  });

  @override
  State<ChooseLocationFromMapScreen> createState() => _ChooseLocationFromMapScreenState();
}

class _ChooseLocationFromMapScreenState extends State<ChooseLocationFromMapScreen> {
  bool isOutOfTurkey = false;

  bool didChanged = false;
  double? newLat;
  double? newLng;

  double? processingLat;
  double? processingLng;

  double markerSize = 40.0;

  String? city;
  String? adress;

  // Türkiye'nin sınırlarını belirleyen LatLngBounds
  final LatLngBounds turkeyBounds = LatLngBounds(
    LatLng(36.0, 26.0), // Güneybatı (southwest) köşesi
    LatLng(42.0, 45.0),  // Kuzeydoğu (northeast) köşesi
  );

  @override
  void initState() {
    super.initState();

    city = widget.userInfo?.location!.city;
    adress = widget.userInfo?.identity!.openAdress;
  }

  @override
  Widget build(BuildContext context) {

    final store = AppReduxStore.currentStore!;

    LatLng initialMapCenter;
    if (widget.userInfo?.location?.lat != null &&
        widget.userInfo?.location?.lng != null) {
      initialMapCenter = LatLng(
        widget.userInfo!.location!.lat!,
        widget.userInfo!.location!.lng!,
      );
    } else if (store.state.currentLocation != null) {
      initialMapCenter = LatLng(
        store.state.currentLocation!.latitude,
        store.state.currentLocation!.longitude,
      );

      String? cityName = findCityForCoordinates(
        store.state.currentLocation!.latitude,
        store.state.currentLocation!.longitude
      );
      if (cityName != null) {
        city = cityName;
      }
    } else {
      initialMapCenter = LatLng(39.925054, 32.836944); // Anıtkabir fallback
      city = "Ankara";
    }

    return Material(
      child: Stack(
        children: [
          Positioned.fill(
            child: FlutterMap(
              options: MapOptions(
                initialCenter: initialMapCenter,
                initialZoom: 15.0,
                minZoom: 5.0,
                maxZoom: 18.0,
                cameraConstraint: CameraConstraint.contain(
                  bounds: turkeyBounds,
                ),
                onPositionChanged: (MapCamera camera, bool hasGesture) {
                  setState(() {
                    processingLat = camera.center.latitude;
                    processingLng = camera.center.longitude;
                    if (hasGesture) {
                      markerSize = 50.0;
                    }
                  });
                },
                onMapEvent: (MapEvent event) async {
                  if( event is MapEventMoveEnd) {
                    setState(() {
                      newLat = processingLat;
                      newLng = processingLng;
            
                      didChanged = true;
            
                      processingLat = null;
                      processingLng = null;
            
                      if( newLat == null || newLng == null ) return;
            
                      String? cityName = findCityForCoordinates(newLat!, newLng!);
                      if (cityName != null) {
                        city = cityName;
                      }
                      markerSize = 40.0;
                    });
            
            
                    if( newLat == null || newLng == null ) return;
            
                    Map<String, dynamic>? newAdressData = await GeocodingApi.getAdressFromCoordinates(newLat!, newLng!);
                    if(newAdressData != null){
                      if( newAdressData['country_code'] != 'tr' ){
                        BenekToastHelper.showErrorToast(
                          BenekStringHelpers.locale('Error'),
                          BenekStringHelpers.locale('outOfTurkey'),
                          context
                        );
            
                        setState(() {
                          isOutOfTurkey = true;
                        });
            
                        return;
                      }
                      setState(() {
                        adress = newAdressData['display_name'];
                        if ( newAdressData['city'] != null ) city = newAdressData['city'];
            
                        isOutOfTurkey = false;
                      });
                    }
                  }
                },
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.benek.app',
                ),
              ],
            ),
          ),
      
          Center(
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: markerSize,
              height: markerSize,
              decoration: BoxDecoration(
                color: AppColors.benekUltraDarkBlue.withAlpha((0.3 * 255).toInt()),
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Container(
                  width: 10.0,
                  height: 10.0,
                  decoration: const BoxDecoration(
                    color: AppColors.benekBlack,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
            ),
          ),

          const SafeArea(
            child: Padding(
              padding: EdgeInsets.only(top: 16.0),
              child: Align(
                alignment: Alignment.topCenter,
                child: LocationWarningWidget(),
              ),
            ),
          ),

          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: SafeArea(
              top: false,
              child: Padding(
                padding: const EdgeInsets.symmetric(
                    horizontal: 12.0, vertical: 12.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        MapBackAndCancelButton(
                          didEdit: didChanged,
                          shouldTakeApprovement: false,
                        ),
                        const SizedBox(width: 6.0),
                        Flexible(
                          flex: 1,
                          child: InfoBar(infoText: 'TUR'),
                        ),
                        const SizedBox(width: 6.0),
                        if (city != null)
                          Flexible(
                            flex: 2,
                            child: InfoBar(infoText: city!),
                          ),
                      ],
                    ),
                    if (adress != null) ...[
                      const SizedBox(height: 6.0),
                      InfoBar(isOpenAdress: true, infoText: adress!),
                    ],

                    const SizedBox(height: 8.0),
                    AddressSaveButton(
                      didEdit: didChanged && !isOutOfTurkey,
                      address: adress,
                      city: city,
                      lat: newLat,
                      lng: newLng,
                      onSave: (resultMap) {
                        Navigator.of(context).pop(resultMap); // sadece burası pop yapar
                      },
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
