var ecust = {
	name: 'Ecust',
	type: '3D-Model-Object',
	ctime: '2016-07-01 10:16:05',
	description: '3D model of Ecust Feng-Xian Area'
};
ecust.models = [
	{
		name: "dormitory",
		type: "rectangle",
		surfaces: [ 'dormitory-south.png', 'dormitory-south.png', 'building-e.png', 'building-e.png', 'building-e.png', 'building-e.png' ],
		size: {
			x: 46, y: 16, z: 20
		}
	},
	{
		name: "laboratory",
		type: "rectangle",
		color: R.colors.purple,
		// surfaces: [ 'dormitory-south.png', 'dormitory-south.png', 'building-e.png', 'building-e.png', 'building-e.png', 'building-e.png' ],
		size: {
			x: 75, y: 14, z: 22
		}
	},
	{
		name: 'road',
		type: 'road',
		color: R.colors.maroon,
		width: 3,
		height: 0.05
	},
	{
		name: 'river',
		type: 'river',
		color: R.colors.blue,
		width: 6,
		height: 0.05
	}
];
ecust.getModel = function ( name ) {
	if ( !name || name === '' )
		return;
	for ( var i = 0; i < ecust.models.length; i++ ) {
		if ( name === ecust.models[ i ].name )
			return ecust.models[ i ];
	}
};
ecust.groups = [
	{
		name: 'Global',
		visible: false,
		position: {
			x: 0, y: 0, z: 0
		},
		entities: [
			{
				name: 'ground',
				type: 'rectangle',
				color: R.colors.gray,
				size: {
					x: 10000, y: 10000, z: 2
				},
				position: {
					x: 0, y: 0, z: -1
				}
			}
		]
	},
	{
		name: 'ZoneB - Buildings',
		position: {
			x: 341, y: -333, z: 0
		},
		rotation: {
			x: 0, y: 0, z: R.dimens.getDegree( 32 )
		},
		entities: [
			{
				name: "Building-Info",
				type: "rectangle",
				surface: 'building-info.png',
				size: {
					x: 166, y: 27, z: 35
				},
				// the position of object,
				position: {
					x: 0, y: 320, z: 0
				}
			},
			{
				name: "Canteen-2",
				type: "rectangle",
				surface: 'canteen-2.png',
				size: {
					x: 40, y: 40, z: 15
				},
				// the position of object,
				position: {
					x: 25, y: 171, z: 0
				}
			},
			{
				name: "Laboratories",
				type: "model",
				model: "laboratory",
				entities: [
					[ 250, 383, 0 ], [ 250, 424, 0 ], [ 250, 475, 0 ], [ 250, 524, 0 ],
					[ 250, 628, 0 ],
					[ 150, 628, 0 ], [ 150, 738, 0 ]
				]
			},
			{
				name: 'Ecust',
				type: 'text',
				text: 'Ecust North Entrance',
				position: {
					x: -150, y: -100, z: 0
				},
				color: 0x00ffff,
				size: 24,
				height: 5
			},
			{
				name: 'Students-Center',
				type: 'prism',
				color: R.colors.silver,
				vertices: [ 0, 0, 0, 51, -30, 51, -30, -15, 51, -15, 51, 0, 0, 0 ],
				height: 12,
				position: {
					x: -565, y: 15, z: 0
				},
				rotation: {
					x: 0, y: 0, z: R.dimens.PI_2
				}
			},
			{
				name: 'Gymnasium',
				type: 'cylinder',
				color: R.colors.silver,
				size: { x: 27, y: 27, z: 11 },
				position: {
					x: -565, y: 110, z: 0
				},
				rotation: {
					x: R.dimens.PI_2, y: 0, z: 0
				}
			},
			{
				name: 'Roads-Zone-B',
				type: 'road',
				model: 'road',
				vertices: [ // using #-* stands for horizontal roads
					[ -100, 0, 0, -100, 300, 0 ], // #+G
					[ 0, 0, 0, 0, 287, 0 ], // #+A
					[ 102, 80, 0, 102, 406, 0 ], // #+B
					[ 204, 406, 0, 204, 790, 0 ], // #+C
					[ 218, 80, 0, 218, 287, 0, 306, 287, 0 ], // #+D
					[ 306, 80, 0, 306, 334, 0, 319, 334, 0, 319, 895, 0 ], // #+E
					[ 425, 80, 0, 425, 916, 0 ], // #+F

					[ -100, 80, 0, 425, 80, 0 ], // #-A
					[ -165, 304, 0, 0, 287, 0, 104, 300, 0, 309, 334, 0, 486, 344, 0 ], // #-B
					[ -114, 406, 0, 417, 406, 0 ], // #-C
					[ 104, 570, 0, 418, 570, 0 ], // #-D
					[ 31, 686, 0, 417, 686, 0 ], // #-E
					[ -353, 790, 0, 423, 790, 0 ] // #-F
				]
			},
			{
				name: 'Roads-Zone-B',
				type: 'river',
				model: 'river',
				vertices: [
					[ 500, 0, 0, -416, 0, 0 ],
					[ 155, 409, 0, 155, 0, 0 ],
					[ -460, 89, 0, -305, 350, 0, -315, 370, 0, -245, 475, 0 ]
					// [ -470, 89, 0, -315, 350, 0, -325, 370, 0, -261, 475, 0 ]
				]
			},
			{
				name: 'Roads-Zone-B',
				type: 'river',
				model: 'river',
				extra: 'bent',
				vertices: [
					[ -416, 0, 0, -455, 30, 0, -460, 89, 0 ]
				]
			},
			{
				name: 'Roads-Zone-B-Border',
				type: 'road',
				model: 'road',
				color: R.colors.maroon,
				width: 15,
				vertices: [ // using @-* stands for horizontal roads
					[ -634, -23, 0, 495, -23, 0, 495, 916, 0, -718, 916, 0, -634, -23, 0 ] // $border
				]
			}

		]
	},
	{
		name: 'ZoneA - Buildings',
		position: {
			x: -250, y: -500, z: 0
		},
		rotation: {
			x: 0, y: 0, z: 0
		},
		entities: [
			{
				name: "Library",
				type: "rectangle",
				surface: 'library.png',
				size: {
					x: 60, y: 60, z: 45
				},
				position: {
					x: 250, y: 500, z: 0
				}
			},
			{
				name: "Building-E",
				type: "rectangle",
				surfaces: [ 'building-e.png', 'building-e.png', 'building-e.png', 'building-e.png', 'building-e.png', 'building-e.png' ],
				size: {
					x: 89, y: 76, z: 22.5
				},
				position: {
					x: 225, y: 400, z: 0
				}
			},
			{
				name: 'Building-AB11',
				type: 'rectangle',
				color: 0x00ffff,
				size: {
					x: 69, y: 12, z: 20
				},
				position: {
					x: -53, y: 368, z: 0
				}
			},
			{
				name: 'Building-AB12',
				type: 'rectangle',
				color: 0x00ffff,
				size: {
					x: 69, y: 12, z: 20
				},
				position: {
					x: 53, y: 368, z: 0
				}
			},
			{
				name: 'Building-AB21',
				type: 'rectangle',
				color: 0x00ffff,
				size: {
					x: 69, y: 12, z: 20
				},
				position: {
					x: -53, y: 417, z: 0
				}
			},
			{
				name: 'Building-AB22',
				type: 'rectangle',
				color: 0x00ffff,
				size: {
					x: 69, y: 12, z: 20
				},
				position: {
					x: 53, y: 417, z: 0
				}
			},
			{
				name: 'Building-D',
				type: 'rectangle',
				color: 0x00ffff,
				size: {
					x: 69, y: 12, z: 22.5
				},
				position: {
					x: -53, y: 468, z: 0
				}
			},
			{
				name: 'Building-C',
				type: 'rectangle',
				color: 0x00ffff,
				size: {
					x: 69, y: 12, z: 22.5
				},
				position: {
					x: 53, y: 468, z: 0
				}
			},
			{
				name: "Dormitories",
				type: "model",
				model: "dormitory",
				entities: [
					[ 41, 62, 0 ], [ 107, 62, 0 ], [ 196, 62, 0 ], [ 259, 62, 0 ],
					[ 41, 107, 0 ], [ 107, 107, 0 ], [ 196, 107, 0 ], [ 259, 107, 0 ],
					[ 41, 155, 0 ], [ 107, 155, 0 ],
					[ 41, 197, 0 ], [ 107, 197, 0 ],
					[ 41, 246, 0 ], [ 107, 246, 0 ], [ 196, 246, 0 ], [ 259, 246, 0 ],
					[ 41, 285, 0 ], [ 107, 285, 0 ], [ 196, 285, 0 ], [ 259, 285, 0 ]
				]
			},
			{
				name: 'Canteen-#1',
				type: 'prism',
				color: R.colors.silver,
				vertices: [ 35, -18, 35, 0, 23, 0, 23, 32,
					28, 36, 30, 40.5, 33, 49, 25, 57, 16.5, 62,
					0, 65, -16.5, 62, -25, 57, -33, 49, -30, 40.5, -28, 36,
					-23, 32, -23, 0, -71, 0, -87, -18, 35, -18 ],
				height: 15,
				position: {
					x: -80, y: 94, z: 0
				},
				rotation: {
					x: 0, y: 0, z: R.dimens.getDegree( 39 )
				}
			},
			{
				name: 'Basketball',
				type: 'plane',
				surface: 'basketball.png',
				size: {
					x: 140, y: 61
				},
				position: {
					x: -80, y: 218, z: 0.1
				}
			},
			{
				name: 'Playground',
				type: 'plane',
				surface: 'playground.png',
				size: {
					x: 110, y: 178
				},
				position: {
					x: -224, y: 384, z: 0.1
				}
			},
			{
				name: 'Volleyball',
				type: 'plane',
				surface: 'volleyball.png',
				size: {
					x: 86, y: 48
				},
				position: {
					x: -53, y: 278, z: 0.1
				}
			},
			{
				name: 'Roads-#01',
				type: 'road',
				model: 'road',
				vertices: [ // #2 means hybrid
					[ 0, 0, 0, 0, 538, 0 ], // #1A
					[ 138, 0, 0, 138, 323.5, 0
						, 115, 323.5, 0, 111, 387, 0, 118, 407, 0, 138, 429, 0, 137, 452, 0
						, 114, 500, 0, 96, 537, 0 ], // #1B
					[ 168, 0, 0, 168, 454, 0 ], // #1C
					[ 312, 14, 0, 290, 452, 0 ], // #1D

					[ 0, 0, 0, 232, 0, 0, 306, 14, 0 ], // #0A
					[ 0, 124, 0, 366, 124, 0, 466, 185, 0 ], // #0B
					[ 0, 136, 0, 366, 136, 0, 466, 197, 0 ], // #0C
					[ 0, 172, 0, -181, 182, 0 ], // #0D
					[ 0, 250, 0, -159, 250, 0 ], // #0E
					[ -121, 452, 0, 290, 452, 0 ], // #0F
					[ -121, 500, 0, 114, 500, 0 ], // #0G
					[ -120, 537, 0, 96, 537, 0 ], // #0H

					[ 0, 0, 0, -39, 0, 0, -335, 374, 0, -335, 598, 0,
						-177, 703, 0, -118, 618, 0, -118, 372, 0, -82, 353, 0,
						0, 335, 0, 68, 326, 0, 115, 323, 0, 158, 322, 0, 223, 324, 0, 294, 341, 0 ] // #2A
					// [ 0, 0, 0, 232, 0, 0, 306, 14, 0 ] // #0A
				]
			}
		]
	}
];



