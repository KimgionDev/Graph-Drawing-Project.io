const themeToggle = document.querySelector(".themeInp");

themeToggle.addEventListener('change', ()=> {
    document.body.classList.toggle('light_theme_var');
})

let cy = null;
let nodeCount = 0;    // Biến đếm số lượng đỉnh
let edgeCount = 0;    // Biến đếm số lượng cung

// Hàm thêm đỉnh mới
function addNode() {
    // Tăng số lượng đỉnh
    nodeCount++;

    // Tạo đỉnh mới
    const newNode = {
        data: {
            id: '' + nodeCount,  // Label đỉnh là số đỉnh
            label: '' + nodeCount
        },
        position: {
            x: Math.random() * 1000,  // Vị trí ngẫu nhiên
            y: Math.random() * 600
        }
    };

    // Thêm đỉnh mới vào đồ thị
    cy.add(newNode);

    // Cập nhật lại giá trị đỉnh trong input
    document.getElementById('nodeCountInput').value = nodeCount;

    // Cập nhật lại input đồ thị
    updateGraphInput();
}

function updateGraphInput() {
    const inputText = document.getElementById('graphInput').value.trim();
    const lines = inputText.split('\n');

    // Thêm thông tin đỉnh mới vào textarea nếu có
    let newInputText = lines.join('\n');
    document.getElementById('graphInput').value = newInputText;
}

// Hàm cập nhật số lượng đỉnh và số lượng cung
function updateGraphInfo() {
    const inputText = document.getElementById('graphInput').value.trim();
    const lines = inputText.split('\n');
    let currentMaxNode = 0;
    let edgeCount = lines.length;

    lines.forEach(line => {
        const edgeData = line.split(' ').map(Number);
        if (edgeData.length >= 2) {
            const source = edgeData[0];
            const target = edgeData[1];
            currentMaxNode = Math.max(currentMaxNode, source, target);
        }
        else if (edgeData.length == 1) {
            currentMaxNode = Math.max(currentMaxNode, edgeData);
        }
    });

    // Cập nhật giá trị đỉnh và cung trong input
    nodeCount = currentMaxNode;
    edgeCount = edgeCount;
    document.getElementById('nodeCountInput').value = nodeCount;
    document.getElementById('edgeCountInput').value = edgeCount;
}
function isValidFloat(num) {
    // Kiểm tra xem num có phải là số thực hợp lệ không
    return !isNaN(num) && num.toString().indexOf('.') !== -1;
}

// Hàm tạo đồ thị và lưu đồ thị dưới dạng danh sách kề
function generateGraph() {
    const inputText = document.getElementById('graphInput').value.trim();
    const lines = inputText.split('\n');
    const graphType = document.querySelector('input[name="graphType"]:checked').value; // Loại đồ thị (có hướng hoặc vô hướng)

    // Danh sách các đỉnh
    let nodes = [];
    for (let i = 1; i <= nodeCount; i++) {
        nodes.push({
            data: {
                id: '' + i,
                label: '' + i
            }
        });
    }

    // Danh sách các cung
    let edges = [];
    let edgeOccurrences = {}; // số lần cung giữa 2 đỉnh xuất hiện
    let nodePositions = {};  // Lưu vị trí các đỉnh đã có

    // Nếu không có cung nào được nhập
    if (lines.length === 0 && nodeCount > 0) {
        // Nếu có đỉnh nhưng không có cung, ta tạo đồ thị với chỉ 1 đỉnh.
        lines.push('');  // Chỉ cần tạo 1 cung trống để giữ các đỉnh
    }

    lines.forEach(line => {
        const edgeData = line.split(' ').map(str => parseFloat(str)); // Sử dụng parseFloat để xử lý cả số âm và số thực
        if (edgeData.length >= 2) {
            const source = edgeData[0];
            const target = edgeData[1];
            const weight = edgeData[2] || 0; // Trọng số có thể là số âm
            // Kiểm tra xem cung đã tồn tại chưa
            if (source < 0 || target < 0 || isValidFloat(source) || isValidFloat(target)){
                alert('Cung khong am hoac so thuc');
                return NULL;
            }
            const edgeKey = source + '-' + target;
            if (!edgeOccurrences[edgeKey]) {
                edgeOccurrences[edgeKey] = 0;
            }
            edgeOccurrences[edgeKey]++;

            // Tính toán vị trí của các cung để tránh trùng lặp
            let offsetX = 0, offsetY = 0;
            if (edgeOccurrences[edgeKey] > 1) {
                offsetX = (Math.random() - 0.5) * 50;  // Random offset to avoid overlap
                offsetY = (Math.random() - 0.5) * 50;
            }

            const edge = {
                data: {
                    source: '' + source,
                    target: '' + target,
                    weight: weight ? String(weight) : '' // Hiển thị trọng số, có thể là số âm
                },
                style: {
                    'line-color': '#000',
                    'target-arrow-color': '#000',
                    'width': 2,
                    'line-style': 'bezier', // Default curved edges
                    'label': weight ? String(weight) : '', // Hiển thị trọng số trên cung
                    'text-background-color': '#fff',  // Background color for the label to make it stand out
                    'text-background-opacity': 1,
                    'text-border-width': 1,
                    'text-border-color': '#000', // Border color for the label
                    'target-arrow-shape': graphType === 'directed' ? 'triangle' : 'none'
                },
                position: {
                    x: offsetX,
                    y: offsetY
                }
            };
            edges.push(edge);
        }
    });

    // Thiết lập Cytoscape
    cy = cytoscape({
        container: document.getElementById('cy'),
        elements: nodes.concat(edges),
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#000',
                    'label': 'data(label)',
                    'color': '#fff',  // Label color is white
                    'font-size': '15px', // Reduced font size for node labels
                    'text-valign': 'center', // Vertically center text inside the node
                    'text-halign': 'center'  // Horizontally center text inside the node
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'line-color': '#000',
                    'target-arrow-color': '#000',
                    'label': 'data(weight)',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier', // Curved edges by default
                    'color': '#000', // Set weight color to black
                    'text-background-color': '#fff',  // Background color for edge labels
                    'text-background-opacity': 1,
                    'text-border-width': 1,
                    'text-border-color': '#000', // Border color for edge weight
                    'font-size': '12px', // Size of edge weight text
                    'text-margin-y': -12  // Position weight above the edge
                }
            }
        ],
        layout: {
            name: 'grid',
            rows: 3
        },
        ready: function () {
            console.log('Graph is ready!');
        }
    });
}

document.getElementById("graphInput").addEventListener("input", function(event) {
    let input = event.target.value;

    // Chỉ cho phép số nguyên, dấu cách, xuống dòng, và dấu "-" cho số âm
    let cleanedInput = input.replace(/[^0-9\s\n\.\-]/g, '');

    // Xử lý từng dòng nhập vào
    cleanedInput = cleanedInput.split('\n').map(line => {
        let parts = line.split(/\s+/).filter(part => part !== ''); // Loại bỏ khoảng trắng thừa

        // Nếu dòng trống hoặc chỉ có Space, giữ nguyên (cho phép nhập tiếp)
        if (line.trim() === "") {
            return line;
        }

        // Nếu đang nhập dở (1 hoặc 2 số và có dấu cách phía sau), giữ nguyên
        if (parts.length === 1 || parts.length === 2) {
            return parts.join(' ') + (line.endsWith(" ") ? " " : ""); // Giữ dấu cách để nhập tiếp
        }

        // Nếu dòng có đúng 2 hoặc 3 số hợp lệ, chuẩn hóa lại
        if (parts.length === 2 || parts.length === 3) {
            return parts.join(' ');
        }
        // Nếu nhập quá 3 số, cảnh báo và chỉ giữ 3 số đầu
        if (parts.length > 3) {
            alert("Mỗi dòng chỉ được nhập tối đa 3 số nguyên!");
            return parts.slice(0, 3).join(' '); // Chỉ lấy 3 số đầu tiên
        }

        return "";
    }).join('\n');

    // Cập nhật lại giá trị vào ô nhập liệu (chỉ khi có sự thay đổi thực sự)
    if (event.target.value !== cleanedInput) {
        event.target.value = cleanedInput;
    }
});