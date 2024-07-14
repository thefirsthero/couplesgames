import 'package:devtodollars/models/game_select_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

class GameSelectTabs extends ConsumerStatefulWidget {
  const GameSelectTabs({super.key});

  @override
  ConsumerState<GameSelectTabs> createState() => _GameSelectTabsState();
}

class _GameSelectTabsState extends ConsumerState<GameSelectTabs> {
  String _selectedIndex = 'solo';

  void _onItemTapped(String index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  List<GameSelectModel> games = [];

  void _getInitialInfo() {
    games = GameSelectModel.getGames();
  }

  @override
  Widget build(BuildContext context) {
    _getInitialInfo();

    return ShadTabs<String>(
      defaultValue: 'solo',
      tabBarConstraints: const BoxConstraints(maxWidth: 400),
      contentConstraints: const BoxConstraints(maxWidth: 400),
      tabs: [
        _buildTab(
          value: 'solo',
          text: 'Solo',
          title: 'Play Solo',
          content: _buildGameList(games),
        ),
        _buildTab(
          value: 'irl',
          text: 'IRL',
          title: 'Play IRL',
          content: _buildGameList(games),
        ),
        _buildTab(
          value: 'online',
          text: 'Online',
          title: 'Play Online',
          content: _buildGameList(games),
        ),
      ],
    );
  }

  ShadTab<String> _buildTab({
    required String value,
    required String text,
    required String title,
    required Widget content,
  }) {
    return ShadTab<String>(
      value: value,
      text: Text(text),
      onPressed: () => _onItemTapped(value),
      content: ShadCard(
        title: Text(title),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [content],
        ),
      ),
    );
  }

  Widget _buildGameList(List<GameSelectModel> games) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const SizedBox(height: 20),
        ListView.separated(
          itemCount: games.length,
          shrinkWrap: true,
          separatorBuilder: (context, index) => const SizedBox(
            height: 25,
          ),
          padding: const EdgeInsets.only(left: 20, right: 20),
          itemBuilder: (context, index) {
            return ListTile(
              leading:
                  CircleAvatar(child: Text(games[index].name[0].toUpperCase())),
              title: Text(games[index].name),
              onTap: () {
                context
                    .pushNamed('${games[index].baseRouteName}_$_selectedIndex');
              },
            );
          },
        )
      ],
    );
  }
}
