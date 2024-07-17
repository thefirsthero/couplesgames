import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shadcn_ui/shadcn_ui.dart';
import 'package:devtodollars/components/common/bottom_nav_bar.dart';
import 'package:devtodollars/models/game_list_model.dart';
import 'package:devtodollars/services/auth_notifier.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  String _selectedIndex = 'solo';
  late List<GameListModel> games;

  @override
  void initState() {
    super.initState();
    _getInitialInfo();
  }

  void _getInitialInfo() {
    games = GameListModel.getGames();
  }

  void _onItemTapped(String index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final authNotif = ref.watch(authProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
        actions: [
          TextButton(
            onPressed: authNotif.signOut,
            child: const Text("Logout"),
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            LayoutBuilder(
              builder: (context, constraints) {
                bool isLandscape = constraints.maxWidth > constraints.maxHeight;
                return Column(
                  children: [
                    const SizedBox(height: 20),
                    ShadTabs<String>(
                      defaultValue: 'solo',
                      tabBarConstraints: const BoxConstraints(maxWidth: 400),
                      contentConstraints: const BoxConstraints(maxWidth: 400),
                      tabs: [
                        _buildTab(
                          value: 'solo',
                          text: 'Solo',
                          title: 'Play Solo',
                          content: _buildGameList(games, isLandscape),
                        ),
                        _buildTab(
                          value: 'irl',
                          text: 'IRL',
                          title: 'Play IRL',
                          content: _buildGameList(games, isLandscape),
                        ),
                        _buildTab(
                          value: 'online',
                          text: 'Online',
                          title: 'Play Online',
                          content: _buildGameList(games, isLandscape),
                        ),
                      ],
                    ),
                  ],
                );
              },
            ),
          ],
        ),
      ),
      bottomNavigationBar: const BottomTabs(initialIndex: 0),
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
      content: ShadCard(
        title: Text(title),
        content: content,
      ),
      onPressed: () => _onItemTapped(value),
    );
  }

  Widget _buildGameList(List<GameListModel> games, bool isLandscape) {
    return isLandscape
        ? Expanded(
            child: ListView.separated(
              itemCount: games.length,
              shrinkWrap: true,
              separatorBuilder: (context, index) => const SizedBox(height: 25),
              padding: const EdgeInsets.only(left: 20, right: 20),
              itemBuilder: (context, index) {
                return _buildGameListItem(games[index]);
              },
            ),
          )
        : SizedBox(
            height: 3 * 75.0, // Adjust height to fit 3 list items
            child: ListView.separated(
              itemCount: games.length,
              shrinkWrap: true,
              separatorBuilder: (context, index) => const SizedBox(height: 25),
              padding: const EdgeInsets.only(left: 20, right: 20),
              itemBuilder: (context, index) {
                return _buildGameListItem(games[index]);
              },
            ),
          );
  }

  Widget _buildGameListItem(GameListModel game) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 5),
      child: ListTile(
        leading: CircleAvatar(child: Text(game.name[0].toUpperCase())),
        title: Text(game.name),
        onTap: () {
          context.pushNamed('${game.baseRouteName}_$_selectedIndex');
        },
        tileColor: Theme.of(context).cardColor,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8.0),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16.0),
      ),
    );
  }
}
