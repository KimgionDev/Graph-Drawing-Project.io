// Hàm duyệt BFS hoặc DFS
function performTraversal() {
    // Reset giá trị trước khi bắt đầu duyệt
    resetTraversal();

    const traversalType = document.getElementById('traversalType').value;

    if (traversalType === 'bfs') {
        performBFS();
    } else if (traversalType === 'dfs') {
        performDFS();
    }
}

function resetTraversal() {
    cy.nodes().style('background-color', ''); 
    // Reset thứ tự đã duyệt
    document.getElementById('visitedOrder').innerText = '';
}

document.getElementById('speedSlider').addEventListener('input', function() {
    document.getElementById('speedValue').innerText = this.value + ' ms';
});

function performBFS() {
    // Lấy thông tin các cung đã nhập
    const inputText = document.getElementById('graphInput').value.trim();
    const lines = inputText.split('\n');
    const startNode = parseInt(document.getElementById('startNodeInput').value);
    let graph = {};

    // Lấy loại đồ thị (có hướng hoặc vô hướng)
    const graphType = document.querySelector('input[name="graphType"]:checked').value;
    // Tạo đồ thị từ các cung nhập vào
    lines.forEach(line => {
        const edgeData = line.split(' ').map(Number);
        if (edgeData.length >= 2) {
            const source = edgeData[0];
            const target = edgeData[1];

            // Tạo đồ thị theo dạng adjacency list
            if (!graph[source]) graph[source] = [];
            if (!graph[target]) graph[target] = [];

            // Thêm cung vào đồ thị
            if (graphType === 'directed') {
                graph[source].push(target);
            }

            // Nếu đồ thị là vô hướng, thêm cung ngược lại
            else if (graphType === 'undirected') {
                graph[source].push(target);
                graph[target].push(source);
            }
        }
    });

    // Chạy thuật toán BFS từ đỉnh 1 (hoặc đỉnh bắt đầu khác)
    bfs(graph, startNode);
}

function bfs(graph, start) {
    const queue = [start]; // Hàng đợi chứa các đỉnh cần duyệt
    const visited = new Set(); // Tập hợp lưu các đỉnh đã duyệt
    const result = []; // Mảng lưu thứ tự duyệt
    const visitedEdges = new Set(); // Tập hợp lưu các cung đã duyệt
    const delay = parseInt(document.getElementById('speedSlider').value); // Lấy giá trị từ thanh trượt

    // Hàm duyệt đỉnh
    function visitNext() {
        if (queue.length === 0) return; // Dừng nếu không còn đỉnh để duyệt

        const vertex = queue.shift(); // Lấy đỉnh đầu tiên trong hàng đợi

        if (!visited.has(vertex)) {
            visited.add(vertex); // Đánh dấu đỉnh đã duyệt
            result.push(vertex); // Thêm đỉnh vào kết quả

            // Tô màu đỏ cho đỉnh đang duyệt
            cy.$(`#${vertex}`).style('background-color', 'red');

            // Cập nhật thứ tự đã duyệt
            document.getElementById('visitedOrder').innerText = result.join(' - ');

            // Thêm các đỉnh kề chưa duyệt vào hàng đợi
            const neighborsToAdd = [];
            if (graph[vertex]) {
                for (const neighbor of graph[vertex]) {
                    if (!visited.has(neighbor)) {
                        neighborsToAdd.push(neighbor);
                    }
                }
            }

            // Nếu số lượng đỉnh kề được thêm vào lớn hơn 1, sắp xếp chúng
            if (neighborsToAdd.length > 1) {
                neighborsToAdd.sort((a, b) => a - b); // Sắp xếp tăng dần
            }

            // Thêm các đỉnh kề đã sắp xếp vào hàng đợi
            queue.push(...neighborsToAdd);
        }

        // Duyệt đỉnh tiếp theo sau một khoảng thời gian trễ
        if (queue.length > 0) {
            setTimeout(visitNext, delay);
        }
    }
    visitNext();
}

function performDFS() {
    // Lấy thông tin các cung đã nhập
    const inputText = document.getElementById('graphInput').value.trim();
    const lines = inputText.split('\n');
    const startNode = parseInt(document.getElementById('startNodeInput').value);
    let graph = {};

    // Lấy loại đồ thị (có hướng hoặc vô hướng)
    const graphType = document.querySelector('input[name="graphType"]:checked').value;
    // Tạo đồ thị từ các cung nhập vào
    lines.forEach(line => {
        const edgeData = line.split(' ').map(Number);
        if (edgeData.length >= 2) {
            const source = edgeData[0];
            const target = edgeData[1];

            // Tạo đồ thị theo dạng adjacency list
            if (!graph[source]) graph[source] = [];
            if (!graph[target]) graph[target] = [];

            // Thêm cung vào đồ thị
            if (graphType === 'directed') {
                graph[source].push(target);
            }

            // Nếu đồ thị là vô hướng, thêm cung ngược lại
            else if (graphType === 'undirected') {
                graph[source].push(target);
                graph[target].push(source);
            }
        }
    });

    // Chạy thuật toán DFS từ đỉnh 1 (hoặc đỉnh bắt đầu khác)
    dfs(graph, startNode);
}

function dfs(graph, start) {
    const stack = [start]; // Ngăn xếp chứa các đỉnh cần duyệt
    const visited = new Set(); // Tập hợp lưu các đỉnh đã duyệt
    const result = []; // Mảng lưu thứ tự duyệt
    const visitedEdges = new Set(); // Tập hợp lưu các cung đã duyệt
    const delay = parseInt(document.getElementById('speedSlider').value); // Lấy giá trị từ thanh trượt

    // Hàm duyệt đỉnh
    function visitNext() {
        if (stack.length === 0) return; // Dừng nếu không còn đỉnh để duyệt

        const vertex = stack.pop(); 

        if (!visited.has(vertex)) {
            visited.add(vertex); // Đánh dấu đỉnh đã duyệt
            result.push(vertex); // Thêm đỉnh vào kết quả

            // Tô màu xanh dương cho đỉnh đang duyệt
            cy.$(`#${vertex}`).style('background-color', 'blue');

            // Cập nhật thứ tự đã duyệt
            document.getElementById('visitedOrder').innerText = result.join(' - ');

            // Thêm các đỉnh kề chưa duyệt vào ngăn xếp
            const neighborsToAdd = [];
            if (graph[vertex]) {
                for (const neighbor of graph[vertex]) {
                    if (!visited.has(neighbor)) {
                        neighborsToAdd.push(neighbor);
                     }
                }
            }

            // Nếu số lượng đỉnh kề được thêm vào lớn hơn 1, sắp xếp chúng
            if (neighborsToAdd.length > 1) {
                neighborsToAdd.sort((a, b) => a - b); // Sắp xếp tăng dần
            }

            // Thêm các đỉnh kề đã sắp xếp vào ngăn xếp
            stack.push(...neighborsToAdd);
        }

        // Duyệt đỉnh tiếp theo sau một khoảng thời gian trễ
        if (stack.length > 0) {
            setTimeout(visitNext, delay);
        }
    }
    visitNext();
}





