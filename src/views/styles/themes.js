//The ability to switch between themes and have them persist
//throughout the page is through the help of Youtuber Kevin Powell
// Link to the video: https://www.youtube.com/watch?v=fyuao3G-2qg&t=1516s&ab_channel=KevinPowell
//And chatGPT aided me in formatting it to work with our system
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    const colorThemes = document.querySelectorAll('[name="Theme"]');
    const storeTheme = function(theme) {
        console.log(`Storing theme: ${theme}`);
        localStorage.setItem("Theme", theme);
    };

    const retrieveTheme = function() {
        const activeTheme = localStorage.getItem("Theme");
        console.log(`Retrieved theme: ${activeTheme}`);
        colorThemes.forEach((themeOption) => {
            if (themeOption.id === activeTheme) {
                themeOption.checked = true;
            }
        });
    };

    retrieveTheme();

    colorThemes.forEach(themeOption => {
        themeOption.addEventListener('click', () => {
           storeTheme(themeOption.id); 
        });
    });
});
