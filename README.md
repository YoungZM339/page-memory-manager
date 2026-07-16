# Page Memory Manager

A page-replacement algorithm visualizer built with React and Vite. It simulates FIFO and LRU strategies and shows frame states, page faults, and replaced pages step by step.

## Features

- Enter comma-separated page-reference sequences.
- Set and validate the number of frames.
- Generate random reference sequences.
- Switch between FIFO and LRU.
- Display each step's page fault, replaced page, and frame history.

## Technology Stack

- React 18
- Vite
- React Bootstrap

## Local Development

The repository includes a pnpm lockfile, so pnpm is recommended:

    pnpm install
    pnpm dev

Other common commands:

    pnpm build
    pnpm lint
    pnpm preview

## Usage

Enter a page-reference sequence and frame count, then select FIFO or LRU to run the simulation. The table records algorithm state changes; it is not a representation of real operating-system or browser memory.

## Intended Use

Suitable for operating-systems courses, algorithm demonstrations, and small experiments. It is not an operating-system memory manager, a performance benchmark, or a production monitoring tool.

## License

The repository currently has no declared license.