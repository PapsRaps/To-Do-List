export const themes = {
    red: {
        '--sidebar-background-color': '#F4E3E0',
        '--sidebar-selected-color': '#e9cdcc',
        '--main-text-color': '#922D2D',
        '--decoration-color': '#E9B7B5',
        '--secondary-accent-color': '#db908d',
        '--accent-color': '#B83232',
        '--page-color1': '#FAF6F2',
        '--page-color2': '#ffedec',
    },

    blue: {
        '--sidebar-background-color': '#E5EDF5',
        '--sidebar-selected-color': '#D2E0EF',
        '--main-text-color': '#315A7D',
        '--decoration-color': '#B8D1E5',
        '--secondary-accent-color': '#83AFCB',
        '--accent-color': '#477FA8',
        '--page-color1': '#F7FAFD',
        '--page-color2': '#EAF3FA',
    },

    yellow: {
        '--sidebar-background-color': '#F5EBD2',
        '--sidebar-selected-color': '#EAD9A9',
        '--main-text-color': '#80601F',
        '--decoration-color': '#E8CD86',
        '--secondary-accent-color': '#D8AD55',
        '--accent-color': '#C18B2C',
        '--page-color1': '#FFFCF2',
        '--page-color2': '#FFF1C9',
    },

    monochrome: {
        '--sidebar-background-color': '#EAE8E5',
        '--sidebar-selected-color': '#DCD9D5',
        '--main-text-color': '#343434',
        '--decoration-color': '#C9C5C0',
        '--secondary-accent-color': '#85817C',
        '--accent-color': '#55514D',
        '--page-color1': '#FAF9F7',
        '--page-color2': '#F0EFED',
    }
};

export function applyTheme(theme) {
    Object.entries(theme).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
    });
}