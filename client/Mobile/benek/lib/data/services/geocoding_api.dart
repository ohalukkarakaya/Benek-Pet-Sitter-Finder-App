part of benek.api;

class GeocodingApi {
  final ApiClient apiClient;

  GeocodingApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;
  static Future<Map<String, dynamic>?> getAdressFromCoordinates( double lat, double lng ) async {
    try{
      String path = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=$lat&lon=$lng';

      var request = http.Request('GET', Uri.parse(path));
      http.StreamedResponse response = await request.send();

      if(response.statusCode == 200){
        var jsonVal = await response.stream.bytesToString();
        var decodedJson = json.decode(jsonVal);
        return { 'country_code': decodedJson['address']['country_code'], 'display_name': decodedJson['display_name'], 'city': decodedJson['address']['province'] };
      }else{
        log('ERROR: getAdressFromCoordinates - ${response.reasonPhrase}');
      }
    }catch(err){
      log('ERROR: getAdressFromCoordinates - $err');
    }
    return null;
  }
}