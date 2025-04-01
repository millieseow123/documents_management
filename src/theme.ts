import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		primary: {
			main: '#1817BC',
		},
	},
	components: {
		MuiMenuItem: {
			styleOverrides: {
				root: {
					'&.Mui-selected': {
						backgroundColor: 'rgba(6, 68, 254, 0.2)',
					},
				},
			},
		},
	},
	typography: {
		fontFamily: `'Inter', sans-serif`,
		button: {
			textTransform: 'none',
		},
	},
});

export default theme;
