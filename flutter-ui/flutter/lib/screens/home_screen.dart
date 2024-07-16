import 'package:devtodollars/components/common/bottom_nav_bar.dart';
import 'package:devtodollars/models/game_list_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:devtodollars/services/auth_notifier.dart';
import 'package:go_router/go_router.dart';
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
        ? Column(mainAxisSize: MainAxisSize.min, children: [
            const SizedBox(height: 20),
            Expanded(
              child: ListView.separated(
                itemCount: games.length,
                shrinkWrap: true,
                separatorBuilder: (context, index) => const SizedBox(
                  height: 25,
                ),
                padding: const EdgeInsets.only(left: 20, right: 20),
                itemBuilder: (context, index) {
                  return ListTile(
                    leading: CircleAvatar(
                        child: Text(games[index].name[0].toUpperCase())),
                    title: Text(games[index].name),
                    onTap: () {
                      context.pushNamed(
                          '${games[index].baseRouteName}_$_selectedIndex');
                    },
                  );
                },
              ),
            )
          ])
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
                  ListView.separated(
                    itemCount: games.length,
                    shrinkWrap: true,
                    separatorBuilder: (context, index) => const SizedBox(
                      height: 25,
                    ),
                    padding: const EdgeInsets.only(left: 20, right: 20),
                    itemBuilder: (context, index) {
                      return ListTile(
                        leading: CircleAvatar(
                            child: Text(games[index].name[0].toUpperCase())),
                        title: Text(games[index].name),
                        onTap: () {
                          context.pushNamed(
                              '${games[index].baseRouteName}_$_selectedIndex');
                        },
                      );
                    },
                  ),
                ],
              ),
            ),
          );
  }
}

class ShadTabItem extends ShadTab<String> {
  ShadTabItem({
    super.key,
    required super.value,
    required String text,
    required String title,
    required Widget content,
    required VoidCallback super.onPressed,
  }) : super(
          text: Text(text),
          content: content,
        );
}
