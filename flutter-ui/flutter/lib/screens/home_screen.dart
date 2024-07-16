import 'package:devtodollars/components/common/bottom_nav_bar.dart';
import 'package:devtodollars/components/home_screen/game_list.dart';
import 'package:devtodollars/components/home_screen/shad_tab.dart';
import 'package:devtodollars/models/game_list_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:devtodollars/services/auth_notifier.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key, required this.title});

  final String title;

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  String _selectedIndex = 'solo';

  void _onItemTapped(String index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  List<GameListModel> games = [];

  void _getInitialInfo() {
    games = GameListModel.getGames();
  }

  @override
  Widget build(BuildContext context) {
    _getInitialInfo();

    final authNotif = ref.watch(authProvider.notifier);
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
        actions: [
          TextButton(onPressed: authNotif.signOut, child: const Text("Logout")),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            LayoutBuilder(
              builder: (context, constraints) {
                bool isLandscape = constraints.maxWidth > constraints.maxHeight;
                return ShadTabs<String>(
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
                );
              },
            ),
          ],
        ),
      ),
      bottomNavigationBar: const BottomTabs(initialIndex: 0),
    );
  }

  ShadTabItem _buildTab({
    required String value,
    required String text,
    required String title,
    required Widget content,
  }) {
    return ShadTabItem(
      value: value,
      text: text,
      title: title,
      content: content,
      onPressed: () => _onItemTapped(value),
    );
  }

  Widget _buildGameList(List<GameListModel> games, bool isLandscape) {
    return isLandscape
        ? Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 20),
              Expanded(
                  child: GameList(games: games, selectedIndex: _selectedIndex)),
            ],
          )
        : SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: ConstrainedBox(
              constraints: BoxConstraints(
                minWidth: MediaQuery.of(context).size.width,
                maxWidth: MediaQuery.of(context).size.width,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const SizedBox(height: 20),
                  GameList(games: games, selectedIndex: _selectedIndex),
                ],
              ),
            ),
          );
  }
}
