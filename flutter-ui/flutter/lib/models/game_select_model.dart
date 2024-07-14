import 'package:flutter/material.dart';

class GameSelectModel {
  String name;
  String iconPath;
  String baseRouteName;
  Color boxColor;

  GameSelectModel({
    required this.name,
    required this.iconPath,
    required this.baseRouteName,
    required this.boxColor,
  });

  static List<GameSelectModel> getGames() {
    List<GameSelectModel> games = [];

    games.add(GameSelectModel(
        name: 'Would You Rather',
        iconPath: 'assets/icons/plate.svg',
        baseRouteName: 'would_you_rather',
        boxColor: Color(0xff9DCEFF)));

    games.add(GameSelectModel(
        name: 'Truth or Dare',
        iconPath: 'assets/icons/pancakes.svg',
        baseRouteName: 'truth_or_dare',
        boxColor: Color(0xffEEA4CE)));

    games.add(GameSelectModel(
        name: 'Never Have I Ever',
        iconPath: 'assets/icons/pie.svg',
        baseRouteName: 'never_have_i_ever',
        boxColor: Color(0xff9DCEFF)));

    games.add(GameSelectModel(
        name: 'Deeper Questions',
        iconPath: 'assets/icons/orange-snacks.svg',
        baseRouteName: 'deeper_questions',
        boxColor: Color(0xffEEA4CE)));

    return games;
  }
}
