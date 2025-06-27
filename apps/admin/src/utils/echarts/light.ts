/**
 * ECharts Light Theme
 *
 * Foreground and background colors are from apps/admin/src/assets/index.css
 * Series colors are from the Tailwind CSS color palette.
 */

const theme = {
  // A vibrant color palette from Tailwind CSS
  // (sky, emerald, yellow, rose, violet, blue)
  color: [
    'hsl(204, 86%, 53%)',
    'hsl(158, 83%, 40%)',
    'hsl(45, 93%, 47%)',
    'hsl(350, 89%, 60%)',
    'hsl(255, 90%, 66%)',
    'hsl(217, 91%, 60%)',
  ],
  // from: var(--background)
  backgroundColor: 'hsl(0 0% 100%)',
  textStyle: {
    // from: var(--foreground)
    color: 'hsl(240 6% 10%)',
    fontFamily: '"Noto Sans SC", sans-serif',
  },
  title: {
    textStyle: {
      // from: var(--label-text)
      color: 'hsl(240 5% 26%)',
    },
  },
  legend: {
    textStyle: {
      // from: var(--muted-foreground)
      color: 'hsl(240 4% 46%)',
    },
  },
  tooltip: {
    // from: var(--popover)
    backgroundColor: 'hsl(0 0% 100%)',
    // from: var(--border)
    borderColor: 'hsl(240 6% 90%)',
    textStyle: {
      // from: var(--foreground)
      color: 'hsl(240 6% 10%)',
    },
    axisPointer: {
      lineStyle: {
        // from: var(--border)
        color: 'hsl(240 6% 90%)',
      },
      crossStyle: {
        // from: var(--border)
        color: 'hsl(240 6% 90%)',
      },
    },
  },
  xAxis: {
    axisLine: {
      lineStyle: {
        // from: var(--border)
        color: 'hsl(240 6% 90%)',
      },
    },
    axisLabel: {
      // from: var(--muted-foreground)
      color: 'hsl(240 4% 46%)',
    },
    splitLine: {
      lineStyle: {
        // from: var(--border)
        color: 'hsl(240 6% 90%)',
      },
    },
  },
  yAxis: {
    axisLine: {
      lineStyle: {
        // from: var(--border)
        color: 'hsl(240 6% 90%)',
      },
    },
    axisLabel: {
      // from: var(--muted-foreground)
      color: 'hsl(240 4% 46%)',
    },
    splitLine: {
      lineStyle: {
        // from: var(--muted)
        color: 'hsl(240 5% 96%)',
      },
    },
  },
  toolbox: {
    iconStyle: {
      // from: var(--muted-foreground)
      borderColor: 'hsl(240 4% 46%)',
    },
  },
}

export default theme
