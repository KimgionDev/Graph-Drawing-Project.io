let network = null;
let nodeCount = 0;    // Biến đếm số lượng đỉnh
let edgeCount = 0;    // Biến đếm số lượng cung

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
        else if (edgeData.length = 1){
            currentMaxNode = Math.max(currentMaxNode, edgeData);
        }
    });

    // Cập nhật giá trị đỉnh và cung trong input
    nodeCount = currentMaxNode;
    edgeCount = edgeCount;
    document.getElementById('nodeCountInput').value = nodeCount;
    document.getElementById('edgeCountInput').value = edgeCount;
}

// Hàm tạo đồ thị
function generateGraph() {
    const inputText = document.getElementById('graphInput').value.trim();
    const lines = inputText.split('\n');
    const graphType = document.getElementById('graphType').value; // Lấy loại đồ thị từ lựa chọn
    const smoothType = document.getElementById('smoothType').value; // Lấy kiểu smooth

    // Danh sách các đỉnh
    let nodes = [];
    for (let i = 1; i <= nodeCount; i++) {
        nodes.push({
            id: i,
            label: '' + i,
            color: '#000',
            font: {
                color: '#fff',
                size: 30,
                face: 'arial',
                background: 'none'
            }
        });
    }

    // Danh sách các cung
    let edges = [];
    let edgeOccurrences = {}; //số lần cung giữa 2 đỉnh xuất hiện

    lines.forEach(line => {
        const edgeData = line.split(' ').map(Number);
        const source = edgeData[0];
        const target = edgeData[1];
        const weight = edgeData[2] || 0;

        // Kiểm tra xem cung đã tồn tại chưa
        const edgeKey = source + '-' + target;
        if (!edgeOccurrences[edgeKey]) {
            edgeOccurrences[edgeKey] = 0;
        }
        edgeOccurrences[edgeKey]++;

        const offset = edgeOccurrences[edgeKey] * 0.5;  // Offset tạo độ cong

        const edge = {
            from: source,
            to: target,
            label: weight ? String(weight) : '',  // Hiển thị trọng số
            arrows: graphType === 'directed' ? {
                to: {
                    enabled: true,
                    scaleFactor: 0.6
                }
            } : undefined,
            color: { color: '#000' },
            smooth: {
                type: smoothType,
                forceDirection: 'none',
                roundness: offset
            },
            length: 400,
            width: 1.85,
            font: {
                size: 17,
                align: 'top',
                color: 'black',
                background: 'white',
                strokeWidth: 1,
                strokeColor: '#fff',
            }
        };
        edges.push(edge);
    });

    // Thiết lập Vis.js
    const container = document.getElementById('cy');
    const data = {
        nodes: nodes,
        edges: edges
    };

    const options = {
        physics: {
            enabled: true, // Kích hoạt chuyển động của các đỉnh khi kéo
        },
        manipulation: {
            enabled: true,
            addNode: function (data, callback) {
                // Tạo đỉnh mới
                data.id = ++nodeCount;
                nodes.push({ id: nodeCount, label: '' + nodeCount });
                updateGraphInput();
                callback(data);
            },
            addEdge: function (data, callback) {
                // Tạo cung mới
                edgeCount++;
                edges.push({ from: data.from, to: data.to });
                updateGraphInput();
                callback(data);
            },
            editEdge: function (data, callback) {
                callback(data);
            }
        },
        edges: {
            smooth: {
                type: smoothType,
                forceDirection: 'none'
            },
            font: {
                align: 'middle'
            }
        },
        interaction: {
            dragNodes: true,
            dragView: true,
        },
    };

    if (network) {
        network.destroy();
    }

    // Tạo mới đồ thị
    network = new vis.Network(container, data, options);
}