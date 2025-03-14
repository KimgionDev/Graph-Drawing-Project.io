document.getElementById("capture_btn").addEventListener("click", function() {
    if (!cy || cy.elements().length === 0) {
        alert("Không có đồ thị!");
        return;
    }

    const pngData = cy.png({ bg: 'white', full: true, scale: 2 });

    const link = document.createElement('a');
    link.href = pngData;
    link.download = 'graph.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});