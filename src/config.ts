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

export const PROCESSING_QUALITY_OPTIONS = [100, 200, 300, 400, 500];
export const PROCESSING_QUALITY_OPTIONS_DEFAULT = PROCESSING_QUALITY_OPTIONS[1];