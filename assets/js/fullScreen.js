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
        const margin = 25;
        if (document.fullscreenElement) {
            graphElement.style.width = '100vw';
            graphElement.style.height = '100vh';
            cy.resize();
            cy.fit();

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

            // Ensure nodes maintain a 25px margin from the edges
            cy.nodes().forEach(node => {
                const pos = node.position();
                if (pos.x < margin) pos.x = margin;
                if (pos.y < margin) pos.y = margin;
                if (pos.x > window.innerWidth - margin) pos.x = window.innerWidth - margin;
                if (pos.y > window.innerHeight - margin) pos.y = window.innerHeight - margin;
                node.position(pos);
            });
        } else {
            graphElement.style.width = '';
            graphElement.style.height = '';
            cy.resize();
            cy.fit();

            const escapeButton = document.getElementById('escapeButton');
            if (escapeButton) {
                escapeButton.remove();
            }

            // Ensure nodes maintain a 25px margin from the edges
            cy.nodes().forEach(node => {
                const pos = node.position();
                if (pos.x < margin) pos.x = margin;
                if (pos.y < margin) pos.y = margin;
                if (pos.x > graphElement.clientWidth - margin) pos.x = graphElement.clientWidth - margin;
                if (pos.y > graphElement.clientHeight - margin) pos.y = graphElement.clientHeight - margin;
                node.position(pos);
            });
        }
    });
});
