import 'package:point_in_polygon/point_in_polygon.dart';

class City {
  final int? code;
  final String name;
  final List<double> coordinates;
  final List<City>? states;

  City({
    this.code,
    required this.name,
    required this.coordinates,
    this.states,
  });

  List<Point> getFormattedCoordinates() {
    List<Point> formattedCoordinates = [];
    for (int i = 0; i < coordinates.length; i += 2) {
      formattedCoordinates.add(Point(x: coordinates[i], y: coordinates[i + 1]));
    }
    return formattedCoordinates;
  }
}