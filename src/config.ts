export const CROP_SCREEN_RATIO_OPTIONS = [
    {
        label: 'Square',
        value: 1,
    },
    {
        label: 'IPhone 10 ( 1125 x 2436 )',
        value: Math.round(1125 / 2436 * 1000) / 1000,
    },
    {
        label: 'FullHD ( 1080 x 1920 )',
        value: Math.round(1080 / 1920 * 1000) / 1000,
    }
];
export const CROP_SCREEN_RATIO_OPTIONS_DEFAULT = CROP_SCREEN_RATIO_OPTIONS[1];

export const PROCESSING_QUALITY_OPTIONS = [
{
    label: 'Poor quality (100px)',
    value: 100,
},{
    label: 'Normal quality (200px)',
    value: 200,
},{
    label: 'Good quality (300px)',
    value: 300,
},{
    label: 'High quality (500px)',
    value: 500,
},

];
export const PROCESSING_QUALITY_OPTIONS_DEFAULT = PROCESSING_QUALITY_OPTIONS[1];