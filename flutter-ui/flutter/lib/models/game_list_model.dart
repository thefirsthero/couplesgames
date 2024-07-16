class GameListModel {
  String name;
  String baseRouteName;

  GameListModel({
    required this.name,
    required this.baseRouteName,
  });

  static List<GameListModel> getGames() {
    List<GameListModel> games = [];

    games.add(GameListModel(
      name: 'Would You Rather',
      baseRouteName: 'would_you_rather',
    ));

    games.add(GameListModel(
      name: 'Truth or Dare',
      baseRouteName: 'truth_or_dare',
    ));

    games.add(GameListModel(
      name: 'Never Have I Ever',
      baseRouteName: 'never_have_i_ever',
    ));

    // games.add(GameListModel(
    //   name: 'Deeper Questions',
    //   baseRouteName: 'deeper_questions',
    // ));

    return games;
  }
}
