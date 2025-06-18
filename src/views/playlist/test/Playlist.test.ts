import { test } from 'vitest';
import { render } from '@testing-library/vue';

import Playlist from '../Playlist.vue';

test('it should work', () => {
  const { getByText } = render(Playlist);

  getByText('Spotify');
});
