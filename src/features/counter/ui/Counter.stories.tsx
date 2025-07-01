// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';
import { Counter } from './Counter';

const meta: Meta<typeof Counter> = {
  title: 'features/counter/Counter',
  component: Counter,
};

export default meta;

export const Default: StoryObj<typeof Counter> = {
  render: () => <Counter />,
};
