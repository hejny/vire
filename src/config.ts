export const CROP_SCREEN_RATIO_OPTIONS = [
    {
        label: 'Square',
        value: 1,
    },
    {
        label: 'IPhoneX ( 1125 x 2436 )',
        value: Math.round(1125 / 2436 * 1000) / 1000,
    },
    {
        label: 'FullHD ( 1080 x 1920 )',
        value: Math.round(1080 / 1920 * 1000) / 1000,
    },
];
export const CROP_SCREEN_RATIO_OPTIONS_DEFAULT = CROP_SCREEN_RATIO_OPTIONS[1];

export const PROCESSING_QUALITY_OPTIONS = [
    {
        label: 'Poor quality',
        value: 100,
    },
    {
        label: 'Normal quality',
        value: 200,
    },
    {
        label: 'Good quality',
        value: 300,
    },
    {
        label: 'High quality',
        value: 500,
    },
];
export const PROCESSING_QUALITY_OPTIONS_DEFAULT = PROCESSING_QUALITY_OPTIONS[1];

export const SNAPPING_OPTIONS = [
    {
        label: 'No Snapping',
        value: 'NONE',
    },
    {
        label: 'Material Design',
        value: 'MATERIAL',
    },
];
export const SNAPPING_OPTIONS_DEFAULT = SNAPPING_OPTIONS[1];
