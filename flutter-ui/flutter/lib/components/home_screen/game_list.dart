import 'package:devtodollars/models/game_select_model.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class GameList extends StatelessWidget {
  final List<GameSelectModel> games;
  final String selectedIndex;

  const GameList({
    Key? key,
    required this.games,
    required this.selectedIndex,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      itemCount: games.length,
      shrinkWrap: true,
      separatorBuilder: (context, index) => const SizedBox(
        height: 25,
      ),
      padding: const EdgeInsets.only(left: 20, right: 20),
      itemBuilder: (context, index) {
        return ListTile(
          leading: CircleAvatar(child: Text(games[index].name[0].toUpperCase())),
          title: Text(games[index].name),
          onTap: () {
            context.pushNamed('${games[index].baseRouteName}_$selectedIndex');
          },
        );
      },
    );
  }
}
