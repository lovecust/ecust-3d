var R = {};
R.colors = {
	red: 0xff0000,
	lime: 0x00ff00,
	blue: 0x0000ff,

	green: 0x008000,
	silver: 0xC0C0C0,
	yellow: 0xFFFF00,
	olive: 0x808000,
	purple: 0x800080,
	gray: 0x808080,
	maroon: 0x800000
};
R.dimens = {
	getDegree: function ( degree ) {
		return Math.PI / 180 * degree;
	},
	PI: Math.PI,
	PI_2: Math.PI / 2,
	PI_3: Math.PI / 3,
	PI_4: Math.PI / 4,
	PI_6: Math.PI / 6
};