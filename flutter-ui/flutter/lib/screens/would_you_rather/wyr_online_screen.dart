import 'package:devtodollars/services/questions_notifier.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

class WYROnlineScreen extends ConsumerStatefulWidget {
  const WYROnlineScreen({super.key});

  @override
  ConsumerState<WYROnlineScreen> createState() => _WYROnlineScreenState();
}

class _WYROnlineScreenState extends ConsumerState<WYROnlineScreen> {
  final _formKey = GlobalKey<ShadFormState>();
  List<String> _rooms = [];
  String _searchText = '';
  bool _isSearching = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(userChoicesProvider.notifier).state = [];
    });
  }

  void _quitGame() {
    context.replaceNamed('gameover');
  }

  void _searchRooms() {
    setState(() {
      _isSearching = true;
      _rooms = [];
      if (_searchText.isNotEmpty) {
        for (int i = 1; i <= 4; i++) {
          _rooms.add('$_searchText$i');
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Would You Rather'),
        actions: [
          IconButton(
            icon: const Icon(Icons.exit_to_app),
            onPressed: _quitGame,
          ),
        ],
      ),
      body: Center(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: ShadForm(
                key: _formKey,
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 350),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      ShadInputFormField(
                        id: 'joinRoom',
                        label: const Text('Join Room'),
                        placeholder: const Text('Enter room name'),
                        description:
                            const Text('Results will be displayed below'),
                        validator: (v) {
                          if (v.length < 4) {
                            return 'Room must be at least 4 characters.';
                          }
                          return null;
                        },
                        onChanged: (v) {
                          setState(() {
                            _searchText = v;
                          });
                        },
                      ),
                      const SizedBox(height: 16),
                      ShadButton(
                        text: const Text('Search'),
                        onPressed: () {
                          if (_formKey.currentState!.saveAndValidate()) {
                            _searchRooms();
                          } else {
                            print('validation failed');
                          }
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ),
            Visibility(
              visible: _isSearching,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: ListView.separated(
                  shrinkWrap: true,
                  separatorBuilder: (context, index) => const SizedBox(),
                  itemCount: _rooms.length,
                  itemBuilder: (context, index) {
                    return Card(
                      child: ShadButton.outline(
                        text: Text(_rooms[index]),
                      ),
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
