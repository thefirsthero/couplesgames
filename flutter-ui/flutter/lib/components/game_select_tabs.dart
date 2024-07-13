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
  int _selectedIndex = 0;

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return ShadTabs<String>(
      defaultValue: 'solo',
      tabBarConstraints: const BoxConstraints(maxWidth: 400),
      contentConstraints: const BoxConstraints(maxWidth: 400),
      tabs: [
        ShadTab(
          value: 'solo',
          text: const Text('Solo'),
          content: ShadCard(
            title: const Text('Play Solo'),
            description: const Text("..."),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(),
              ],
            ),
          ),
        ),
        ShadTab(
          value: 'irl',
          text: const Text('IRL'),
          content: ShadCard(
            title: const Text('Play IRL'),
            description: const Text("..."),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(),
              ],
            ),
          ),
        ),
        ShadTab(
          value: 'online',
          text: const Text('Online'),
          content: ShadCard(
            title: const Text('Play Online'),
            description: const Text("..."),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
