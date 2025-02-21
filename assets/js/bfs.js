// Hàm BFS cho đồ thị
function bfs(graph, start) {
    const queue = [start];
    const visited = new Set();
    const result = [];

    while (queue.length) {
        const vertex = queue.shift();

        if (!visited.has(vertex)) {
            visited.add(vertex);
            result.push(vertex);

            // Thay đổi màu đỉnh thành đỏ
            setTimeout(() => {
                const node = nodes.find(n => n.id === vertex);
                if (node) {
                    node.color = 'red';  // Đổi màu đỉnh thành đỏ
                    network.setData({ nodes: nodes, edges: edges }); // Cập nhật đồ thị
                }
            }, 2000 * result.length); // Delay 2 giây

            // Duyệt qua các láng giềng
            for (const neighbor of graph[vertex]) {
                queue.push(neighbor);
            }
        }
    }

    return result;
}

// Hàm tạo đồ thị và lưu đồ thị dưới dạng danh sách kề
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
            color: '#000', // Màu mặc định là đen
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

    // Duyệt đồ thị theo BFS
    let graph = {};
    for (let i = 1; i <= nodeCount; i++) {
        graph[i] = [];
    }

    lines.forEach(line => {
        const edgeData = line.split(' ').map(Number);
        const source = edgeData[0];
        const target = edgeData[1];
        graph[source].push(target);
        if (graphType === 'undirected') {
            graph[target].push(source); // Đồ thị vô hướng
        }
    });

    // Bắt đầu duyệt BFS từ đỉnh 1 (hoặc có thể thay đổi start node tùy ý)
    bfs(graph, 1);
}
