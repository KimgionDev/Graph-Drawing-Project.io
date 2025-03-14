document.addEventListener("DOMContentLoaded", function() {
    const graphElement = document.getElementById('cy');
    const fullScreenButton = document.getElementById('fullScreen');

    fullScreenButton.addEventListener('click', function() {
        if (graphElement.requestFullscreen) {
            graphElement.requestFullscreen();
        } else if (graphElement.mozRequestFullScreen) { // Firefox
            graphElement.mozRequestFullScreen();
        } else if (graphElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
            graphElement.webkitRequestFullscreen();
        } else if (graphElement.msRequestFullscreen) { // IE/Edge
            graphElement.msRequestFullscreen();
        }
    });

    document.addEventListener('fullscreenchange', function() {
        if (document.fullscreenElement) {
            const escapeButton = document.createElement('button');
            escapeButton.innerText = 'X';
            escapeButton.id = 'escapeButton';
            escapeButton.style.position = 'fixed';
            escapeButton.style.top = '10px';
            escapeButton.style.right = '10px';
            escapeButton.style.zIndex = '1000';
            document.body.appendChild(escapeButton);

            escapeButton.addEventListener('click', function() {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) { // Firefox
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { // IE/Edge
                    document.msExitFullscreen();
                }
            });
        } else {
            const escapeButton = document.getElementById('escapeButton');
            if (escapeButton) {
                escapeButton.remove();
            }
        }
    });
});
