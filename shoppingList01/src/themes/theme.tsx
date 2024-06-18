import { PaletteMode } from "@mui/material";

const getShoppingAppTheme = (_mode: PaletteMode) => ({
  typography: {
    fontSize: 15,
    fontFamily: ["Roboto"],
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f1f1f1",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 400,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          textTransform: "none",
          color: `primary.dark`,
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent !important",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
          color: `primary.main`,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: `rgba(71, 84, 201, 0.1) !important`,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: `#16a2e0`,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: "#3cc2ff",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "30px",
        },
      },
    },
  },
  palette: {
    _mode,
    primary: {
      light: "#000",
      main: "#5153a0",
      dark: "#002884",
      contrastText: "#fff",
    },
    info: {
      light: "#000",
      main: "#000",
      dark: "#000",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#696969",
      dark: "#603c64",
      contrastText: "#fff",
    },
  },
});

export default getShoppingAppTheme;
