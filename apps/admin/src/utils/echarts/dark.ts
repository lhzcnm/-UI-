/**
 * ECharts Dark Theme
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
  backgroundColor: 'hsl(240 10% 4%)',
  textStyle: {
    // from: var(--foreground)
    color: 'hsl(240 6% 90%)',
  },
  title: {
    textStyle: {
      // from: var(--label-text)
      color: 'hsl(240 5% 84%)',
    },
  },
  legend: {
    textStyle: {
      // from: var(--muted-foreground)
      color: 'hsl(240 4% 46%)',
    },
  },
  tooltip: {
    // from: var(--card)
    backgroundColor: 'hsl(240 6% 10%)',
    // from: var(--border)
    borderColor: 'hsl(240 4% 18%)',
    textStyle: {
      // from: var(--foreground)
      color: 'hsl(240 6% 90%)',
    },
    axisPointer: {
      lineStyle: {
        color: 'hsl(240 4% 18%)',
      },
      crossStyle: {
        color: 'hsl(240 4% 18%)',
      },
    },
  },
  xAxis: {
    axisLine: {
      lineStyle: {
        // from: var(--border)
        color: 'hsl(240 4% 18%)',
      },
    },
    axisLabel: {
      // from: var(--muted-foreground)
      color: 'hsl(240 4% 46%)',
    },
    splitLine: {
      lineStyle: {
        // from: var(--border)
        color: 'hsl(240 4% 18%)',
      },
    },
  },
  yAxis: {
    axisLine: {
      lineStyle: {
        // from: var(--border)
        color: 'hsl(240 4% 18%)',
      },
    },
    axisLabel: {
      // from: var(--muted-foreground)
      color: 'hsl(240 4% 46%)',
    },
    splitLine: {
      lineStyle: {
        // from: var(--muted)
        color: 'hsl(240 4% 16%)',
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