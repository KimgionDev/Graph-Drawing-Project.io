let cy = null;
let nodeCount = 0;    
let edgeCount = 0;    

function addNode() {
    nodeCount++;

    const newNode = {
        data: {
            id: '' + nodeCount,  
            label: '' + nodeCount
        },
        position: {
            x: Math.random() * 1000,  
            y: Math.random() * 600
        }
    };

    cy.add(newNode);
    document.getElementById('nodeCountInput').value = nodeCount;
    updateGraphInput();
}

function updateGraphInput() {
    const inputText = document.getElementById('graphInput').value.trim();
    const lines = inputText.split('\n');
    let newInputText = lines.join('\n');
    document.getElementById('graphInput').value = newInputText;
}
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
    nodeCount = currentMaxNode;
    edgeCount = edgeCount;
    document.getElementById('nodeCountInput').value = nodeCount;
    document.getElementById('edgeCountInput').value = edgeCount;
}
function isValidFloat(num) {
    // Kiểm tra xem num có phải là số thực hợp lệ không
    return !isNaN(num) && num.toString().indexOf('.') !== -1;
}

function generateGraph() {
    const inputText = document.getElementById('graphInput').value.trim();
    const lines = inputText.split('\n');
    const graphType = document.querySelector('input[name="graphType"]:checked').value;
    let nodes = [];
    for (let i = 1; i <= nodeCount; i++) {
        nodes.push({
            data: {
                id: '' + i,
                label: '' + i
            }
        });
    }

    let edges = [];
    let edgeOccurrences = {}; 
    let nodePositions = {}; 
    const visitedOrder = document.getElementById("visitedOrder");
    // Nếu không có cung nào được nhập
    if (lines.length === 0 && nodeCount > 0) {
        // Nếu có đỉnh nhưng không có cung, ta tạo đồ thị với chỉ 1 đỉnh.
        lines.push('');  // Chỉ cần tạo 1 cung trống để giữ các đỉnh
    }

    lines.forEach(line => {
        const edgeData = line.split(' ').map(str => parseFloat(str)); 
        if (edgeData.length >= 2) {
            const source = edgeData[0];
            const target = edgeData[1];
            const weight = edgeData[2] || 0; // Trọng số có thể là số âm
            if (source < 0 || target < 0 || isValidFloat(source) || isValidFloat(target)) {
                visitedOrder.innerHTML = "Lỗi! Cung không âm hoặc số thực";
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
                offsetX = (Math.random() - 0.5) * 50; 
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
                    'line-style': 'bezier', 
                    'label': weight ? String(weight) : '',
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
                    'color': '#fff',  // Label color
                    'font-size': '15px', 
                    'text-valign': 'center', 
                    'text-halign': 'center',
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
                    'curve-style': 'bezier',
                    'color': '#000', 
                    'text-background-color': '#fff',  
                    'text-background-opacity': 1,
                    'text-border-width': 1,
                    'text-border-color': '#000', // Border color for edge weight
                    'font-size': '14px', 
                    'text-margin-y': -12  
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

document.getElementById("graphInput").addEventListener("input", function (event) {
    let input = event.target.value;

    // Chỉ cho phép số nguyên, dấu cách, xuống dòng, và dấu "-" cho số âm
    let cleanedInput = input.replace(/[^0-9\s\n\.\-]/g, '');

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
            // visitedOrder.innerHTML = "Mỗi dòng chỉ được nhập tối đa 3 số nguyên!";
            return parts.slice(0, 3).join(' '); // Chỉ lấy 3 số đầu tiên
        }

        return "";
    }).join('\n');

    // Cập nhật lại giá trị vào ô nhập liệu (chỉ khi có sự thay đổi thực sự)
    if (event.target.value !== cleanedInput) {
        event.target.value = cleanedInput;
    }
});



