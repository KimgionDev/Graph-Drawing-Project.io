async function performTraversal() {
    // Disable các phần nhập liệu khi bắt đầu duyệt
    toggleInputs(true);

    // Reset giá trị trước khi bắt đầu duyệt
    resetTraversal();

    const traversalType = document.getElementById('traversalType').value;
    const startNode = parseInt(document.getElementById('startNodeInput').value);

    if (traversalType === 'bfs') {
        await performBFS(startNode);  // Chờ BFS hoàn thành
        enableInputs();  // Enable lại các nút khi BFS xong
    } else if (traversalType === 'dfs') {
        await performDFS(startNode);  // Chờ DFS hoàn thành
        enableInputs();  // Enable lại các nút khi DFS xong
    } else if (traversalType === 'dfs-recursion') {
        performDFSRecursion(startNode);  
    }
}

function toggleInputs(disable) {
    // Disable hoặc enable các thành phần nhập liệu
    document.getElementById('graphInput').disabled = disable;
    document.getElementById('creatGraph').disabled = disable; 
    document.getElementById('traversalType').disabled = disable;
    document.getElementById('startNodeInput').disabled = disable;
    document.getElementById('speedSlider').disabled = disable;
}

function enableInputs() {
    // Enable lại các thành phần nhập liệu khi duyệt xong
    toggleInputs(false);
    console.log("Traversal completed successfully.");
}

function resetTraversal() {
    cy.nodes().style('background-color', ''); 
    // Reset thứ tự đã duyệt
    document.getElementById('visitedOrder').innerText = '';
}

async function performBFS(startNode) {
    const inputText = document.getElementById('graphInput').value.trim();
    const lines = inputText.split('\n');
    let graph = {};

    const graphType = document.querySelector('input[name="graphType"]:checked').value;
    lines.forEach(line => {
        const edgeData = line.split(' ').map(Number);
        if (edgeData.length >= 2) {
            const source = edgeData[0];
            const target = edgeData[1];

            if (!graph[source]) graph[source] = [];
            if (!graph[target]) graph[target] = [];

            if (graphType === 'directed') {
                graph[source].push(target);
            } else if (graphType === 'undirected') {
                graph[source].push(target);
                graph[target].push(source);
            }
        }
    });

    await bfs(graph, startNode);  // Đợi BFS hoàn tất
}

async function bfs(graph, start) {
    const queue = [start]; // Hàng đợi chứa các đỉnh cần duyệt
    const visited = new Set(); // Tập hợp lưu các đỉnh đã duyệt
    const result = []; // Mảng lưu thứ tự duyệt
    const visitedEdges = new Set(); // Tập hợp lưu các cung đã duyệt
    const delay = parseInt(document.getElementById('speedSlider').value); // Lấy giá trị từ thanh trượt

    // Hàm duyệt đỉnh
    async function visitNext() {
        if (queue.length === 0) {
            return; // Dừng nếu không còn đỉnh để duyệt
        }

        const vertex = queue.shift(); // Lấy đỉnh đầu tiên trong hàng đợi

        if (!visited.has(vertex)) {
            visited.add(vertex); // Đánh dấu đỉnh đã duyệt
            result.push(vertex); // Thêm đỉnh vào kết quả

            // Tô màu đỏ cho đỉnh đang duyệt
            cy.$(`#${vertex}`).style('background-color', '#ef476f');

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
            await new Promise(resolve => setTimeout(resolve, delay)); // Chờ trong thời gian delay
            await visitNext(); // Tiếp tục duyệt
        }
    }
    
    await visitNext(); // Chờ khi BFS hoàn tất
}

async function performDFS(startNode) {
    const inputText = document.getElementById('graphInput').value.trim();
    const lines = inputText.split('\n');
    let graph = {};

    const graphType = document.querySelector('input[name="graphType"]:checked').value;
    lines.forEach(line => {
        const edgeData = line.split(' ').map(Number);
        if (edgeData.length >= 2) {
            const source = edgeData[0];
            const target = edgeData[1];

            if (!graph[source]) graph[source] = [];
            if (!graph[target]) graph[target] = [];

            if (graphType === 'directed') {
                graph[source].push(target);
            } else if (graphType === 'undirected') {
                graph[source].push(target);
                graph[target].push(source);
            }
        }
    });

    await dfs(graph, startNode);  // Đợi DFS hoàn tất
}

async function dfs(graph, start) {
    const stack = [start]; // Ngăn xếp chứa các đỉnh cần duyệt
    const visited = new Set(); // Tập hợp lưu các đỉnh đã duyệt
    const result = []; // Mảng lưu thứ tự duyệt
    const visitedEdges = new Set(); // Tập hợp lưu các cung đã duyệt
    const delay = parseInt(document.getElementById('speedSlider').value); // Lấy giá trị từ thanh trượt

    // Hàm duyệt đỉnh
    async function visitNext() {
        if (stack.length === 0) {
            return; // Dừng nếu không còn đỉnh để duyệt
        }

        const vertex = stack.pop(); // Lấy đỉnh cuối cùng trong ngăn xếp

        if (!visited.has(vertex)) {
            visited.add(vertex); // Đánh dấu đỉnh đã duyệt
            result.push(vertex); // Thêm đỉnh vào kết quả

            // Tô màu xanh dương cho đỉnh đang duyệt
            cy.$(`#${vertex}`).style('background-color', '#03a9f4');

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
            await new Promise(resolve => setTimeout(resolve, delay)); // Chờ trong thời gian delay
            await visitNext(); // Tiếp tục duyệt
        }
    }

    await visitNext(); // Chờ khi DFS hoàn tất
}

function performDFSRecursion(startNode) {
    const inputText = document.getElementById('graphInput').value.trim();
    const lines = inputText.split('\n');
    let graph = {};

    const graphType = document.querySelector('input[name="graphType"]:checked').value;
    lines.forEach(line => {
        const edgeData = line.split(' ').map(Number);
        if (edgeData.length >= 2) {
            const source = edgeData[0];
            const target = edgeData[1];

            if (!graph[source]) graph[source] = [];
            if (!graph[target]) graph[target] = [];

            if (graphType === 'directed') {
                graph[source].push(target);
            } else if (graphType === 'undirected') {
                graph[source].push(target);
                graph[target].push(source);
            }
        }
    });

    dfsRecursion(graph, startNode, new Set(), parseInt(document.getElementById('speedSlider').value), () => {
        enableInputs(); // Enable inputs khi DFS đệ quy xong
    });
}

function dfsRecursion(graph, vertex, visited = new Set(), delay, callback) {
    if (visited.has(vertex)) return;

    visited.add(vertex);

    setTimeout(() => {
        cy.$(`#${vertex}`).style('background-color', '#52b788');
        let visitedOrder = document.getElementById('visitedOrder').innerText;
        if (visitedOrder.length > 0) {
            visitedOrder += ' - ';
        }
        visitedOrder += vertex;
        document.getElementById('visitedOrder').innerText = visitedOrder;

        if (graph[vertex]) {
            const neighbors = graph[vertex].slice().sort((a, b) => a - b);
            let index = 0;

            function visitNextNeighbor() {
                if (index < neighbors.length) {
                    const neighbor = neighbors[index++];
                    if (!visited.has(neighbor)) {
                        dfsRecursion(graph, neighbor, visited, delay, visitNextNeighbor);
                    } else {
                        visitNextNeighbor();
                    }
                } else if (callback) {
                    callback(); 
                }
            }
            visitNextNeighbor();
        } else if (callback) {
            callback();
        }
    }, delay);
}
