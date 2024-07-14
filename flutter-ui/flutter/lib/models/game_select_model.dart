import 'package:flutter/material.dart';

class GameSelectModel {
  String name;
  String baseRouteName;

  GameSelectModel({
    required this.name,
    required this.baseRouteName,
  });

  static List<GameSelectModel> getGames() {
    List<GameSelectModel> games = [];

    games.add(GameSelectModel(
      name: 'Would You Rather',
      baseRouteName: 'would_you_rather',
    ));

    games.add(GameSelectModel(
      name: 'Truth or Dare',
      baseRouteName: 'truth_or_dare',
    ));

    games.add(GameSelectModel(
      name: 'Never Have I Ever',
      baseRouteName: 'never_have_i_ever',
    ));

    games.add(GameSelectModel(
      name: 'Deeper Questions',
      baseRouteName: 'deeper_questions',
    ));

    return games;
  }
}
