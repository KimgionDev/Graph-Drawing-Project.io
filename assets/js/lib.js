/**
 * ---Author---
 * Lexipit3268
 * TranTrong Fuc
 * DucFat
 * DoanTaiLoc
 * 
 */
const colors = {
    red: "#ef476f",
    blue: "#03a9f4",
    green: "#52b788",
    gray: "#5c677d",
    yellow: "#f8c302",
    bettergreen: "#05c102",
}

let isStopped = false; //tai moi thuat toan, KIEM TRA isStopped ok?

document.querySelector(".btn-stop").addEventListener("click", function () {
    stopTraversal();
});

function stopTraversal() {
    isStopped = true;
    toggleInputs(false);
    resetTraversal();
    console.log("Đã dừng thuật toán và khôi phục trạng thái ban đầu.");

    setTimeout(() => {
        isStopped = false;
        console.log("Đã đặt lại trạng thái isStopped.");
    }, 1000);
}


// Ràng buộc nhập đỉnh start/end
document.getElementById("startNodeInput").addEventListener("input", function () {
    const startNode = parseInt(this.value);
    const nodeCount = document.getElementById("nodeCountInput").value;
    if (startNode > nodeCount) {
        this.value = nodeCount;
    }
    else if (startNode < 1) {
        this.value = 1;
    }
});

document.getElementById("endNodeInput").addEventListener("input", function () {
    const endNode = parseInt(this.value);
    const nodeCount = document.getElementById("nodeCountInput").value;
    if (endNode > nodeCount) {
        this.value = nodeCount;
    }
    else if (endNode < 1) {
        this.value = 1;
    }
});
//an endNodeInput
document.addEventListener("DOMContentLoaded", function () {
    const traversalSelect = document.getElementById("traversalType");
    const endNodeInputGroup = document.querySelector(".pointEnd");

    // Mặc định ẩn endNodeInput
    endNodeInputGroup.style.display = "none";

    traversalSelect.addEventListener("change", function () {
        if (this.value === "mooreDijkstra" || this.value === "bellmanFord") {
            endNodeInputGroup.style.display = "flex";
        } else {
            endNodeInputGroup.style.display = "none";
        }
    });
});

/**
 * 
 * 
 * Exception check for Algorithm
 * 
 * 
 */
document.getElementById("traversalType").addEventListener("change", function () {
    const graphTypeRadios = document.getElementsByName("graphType");
    const directedRadio = graphTypeRadios[0];
    const undirectedRadio = graphTypeRadios[1];
    const selectedAlgorithm = this.value;
    const createGraphButton = document.getElementById("creatGraph");
    const startNodes = document.getElementById("startNodeInput");
    if (selectedAlgorithm === "bipartite") {
        directedRadio.disabled = true;
        directedRadio.parentElement.style.opacity = "0.75";
        undirectedRadio.checked = true;
        undirectedRadio.parentElement.style.opacity = "1";
        updateGraphToUndirected();
        createGraphButton.click();
    } else if (selectedAlgorithm === "topoSort" || selectedAlgorithm === "ranked") {
        undirectedRadio.disabled = true;
        undirectedRadio.parentElement.style.opacity = "0.75";
        directedRadio.checked = true;
        directedRadio.parentElement.style.opacity = "1";
        startNodes.disabled = true;
        createGraphButton.click();
    } else if (selectedAlgorithm === "bellmanFord") {
        undirectedRadio.disabled = true;
        undirectedRadio.parentElement.style.opacity = "0.75";
        directedRadio.checked = true;
        directedRadio.parentElement.style.opacity = "1";
        createGraphButton.click();
    } else if (selectedAlgorithm === "kruskal") {
        directedRadio.disabled = true;
        directedRadio.parentElement.style.opacity = "0.75";
        undirectedRadio.checked = true;
        undirectedRadio.parentElement.style.opacity = "1";
        startNodes.disabled = true;
        createGraphButton.click();
    } else {
        directedRadio.disabled = false;
        undirectedRadio.disabled = false;
        startNodes.disabled = false;
        directedRadio.parentElement.style.opacity = "1";
        undirectedRadio.parentElement.style.opacity = "1";
    }
});

function updateGraphToUndirected() {
    console.log("Đã đổi đồ thị thành vô hướng.");
}

async function performTraversal() {
    toggleInputs(true); // Khóa input khi thuật toán chạy
    resetTraversal();   // Reset trạng thái đồ thị

    const traversalType = document.getElementById("traversalType").value;
    const startNode = parseInt(document.getElementById("startNodeInput").value);

    if (traversalType === "bfs") {
        await performBFS(startNode);
    } else if (traversalType === "dfs") {
        await performDFS(startNode);
    } else if (traversalType === "dfs-recursion") {
        performDFSRecursion(startNode);
    } else if (traversalType === "mooreDijkstra") {
        await mooreDijkstra();
    } else if (traversalType === "bipartite") {
        await checkBipartite();
    } else if (traversalType === "Tarjan") {
        await performTarjan();
    } else if (traversalType === "Circled") {
        await checkCycle();
    } else if (traversalType === "bellmanFord") {
        await bellmanFord();
    } else if (traversalType === "topoSort") {
        await performTopoSort();
    } else if (traversalType === "ranked") {
        await performRanked();
    } else if (traversalType === "bfsfull"){
        await performBFSFull();
    } else if (traversalType === "dfs-fullGraph") {
        await performDFSFull();
    } else if (traversalType === "dfs-recursion-fullGraph") {
        await performDFSRecursionFull();
    } else if (traversalType === "kruskal"){
        await Kruskal();
    }
    toggleInputs(false); // Mở lại input sau khi chạy xong
}

function toggleInputs(disable) {
    const traversalType = document.getElementById("traversalType").value;
    const graphTypeRadios = document.getElementsByName("graphType");
    const directedRadio = graphTypeRadios[0];
    const undirectedRadio = graphTypeRadios[1];
    if (traversalType === "topoSort" || traversalType === "ranked" || traversalType === "bellmanFord") {
        directedRadio.disabled = disable; 
    }
    else if (traversalType === "kruskal" || traversalType === "bipartite"){
        undirectedRadio.disabled = disable;
    }
    else {
        directedRadio.disabled = disable;
        undirectedRadio.disabled = disable; 
    }
    document.getElementById("graphInput").disabled = disable;
    document.getElementById("creatGraph").disabled = disable;
    document.getElementById("traversalType").disabled = disable;
    document.getElementById("startNodeInput").disabled = disable;
    if (traversalType === "topoSort" || traversalType === "ranked" || traversalType === "kruskal") {
        document.getElementById("startNodeInput").disabled = true;
    }
    document.getElementById("endNodeInput").disabled = disable;
}

function resetTraversal() {
    // Reset màu của tất cả đỉnh
    cy.nodes().style("background-color", "");

    // Reset màu của tất cả cung (edges) về mặc định
    cy.edges().style("line-color", "black");

    // Reset thứ tự đã duyệt
    document.getElementById("visitedOrder").innerText = "";
}

function enableInputs() {
    // Enable lại các thành phần nhập liệu khi duyệt xong
    toggleInputs(false);
    console.log("Traversal completed successfully.");
}

// Cap nhat delay
let delay = parseInt(document.getElementById('speedSlider').value); 
document.getElementById('speedSlider').addEventListener('input', function() {
    delay = parseInt(this.value); 
});

// BFSSSSSSSSSSSSS
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
    const queue = [start];
    const visited = new Set();
    const result = []; // Mảng lưu thứ tự duyệt
    const visitedEdges = new Set();
    // const delay = parseInt(document.getElementById('speedSlider').value);

    async function visitNext() {
        if (queue.length === 0) {
            return;
        }
        if (isStopped) return;
        const vertex = queue.shift();

        if (!visited.has(vertex)) {
            visited.add(vertex);
            result.push(vertex);

            cy.$(`#${vertex}`).style('background-color', colors.red);

            document.getElementById('visitedOrder').innerText = result.join(' - ');

            const neighborsToAdd = [];
            if (graph[vertex]) {
                for (const neighbor of graph[vertex]) {
                    if (!visited.has(neighbor)) {
                        neighborsToAdd.push(neighbor);
                    }
                }
            }


            if (neighborsToAdd.length > 1) {
                neighborsToAdd.sort((a, b) => a - b);
            }

            queue.push(...neighborsToAdd);
        }

        if (queue.length > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            await visitNext();
        }
    }

    await visitNext();
}

// DFS STACKKKKKKKKKKKKKKK
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

    await dfs(graph, startNode);
}

async function dfs(graph, start) {
    const stack = [start];
    const visited = new Set();
    const result = [];
    const visitedEdges = new Set();
    // const delay = parseInt(document.getElementById('speedSlider').value);

    async function visitNext() {
        if (stack.length === 0) {
            return;
        }
        if (isStopped) return;

        const vertex = stack.pop();

        if (!visited.has(vertex)) {
            visited.add(vertex);
            result.push(vertex);

            cy.$(`#${vertex}`).style('background-color', colors.blue);

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


// DFS RECURSIONNNNNNNNNNNNNNNN
function performDFSRecursion(startNode) {
    const inputText = document.getElementById('graphInput').value.trim();
    const lines = inputText.split('\n');
    let delay = parseInt(document.getElementById('speedSlider').value); 
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
    dfsRecursion(graph, startNode, new Set(), delay, () => {
        toggleInputs(false); // Enable inputs khi DFS đệ quy xong
    });
}

function dfsRecursion(graph, vertex, visited = new Set(), delay, callback) {
    if (isStopped) return;
    if (visited.has(vertex)) return;
    visited.add(vertex);

    setTimeout(() => {
        if (isStopped) return;
        cy.$(`#${vertex}`).style('background-color', colors.green);
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
                    if (isStopped) return;
                    const neighbor = neighbors[index++];
                    if (!visited.has(neighbor)) {
                        if (isStopped) return;
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
    toggleInputs(true);
}


// MOOREDIJKSTRAAAAAAAAAAAAAAA
async function mooreDijkstra() {
    const startNode = parseInt(document.getElementById("startNodeInput").value);
    const endNode = parseInt(document.getElementById("endNodeInput").value);
    const visitedOrder = document.getElementById("visitedOrder");
    // const speedSlider = document.getElementById("speedSlider");
    const graphType = document.querySelector('input[name="graphType"]:checked').value;

    if (isNaN(startNode) || isNaN(endNode)) {
        visitedOrder.innerHTML = "Vui lòng nhập đỉnh hợp lệ.";
        return;
    }
    if (isStopped) return;

    const inputText = document.getElementById("graphInput").value.trim();
    const lines = inputText.split("\n");
    let graph = {};
    let allNodes = new Set();

    for (let line of lines) {
        const [u, v, w] = line.split(" ").map(Number);
        if (w < 0) {
            visitedOrder.innerHTML = "Trọng số không âm.";
            toggleInputs(false);
            return;
        }
        if (w == null) {
            visitedOrder.innerHTML = "Vui lòng nhập trọng số.";
            toggleInputs(false);
            return;
        }
        if (!graph[u]) graph[u] = [];
        graph[u].push({ node: v, weight: w });
        if (graphType === 'undirected') {
            if (!graph[v]) graph[v] = [];
            graph[v].push({ node: u, weight: w });
        }

        allNodes.add(u);
        allNodes.add(v);
    }

    if (!allNodes.has(endNode) || !allNodes.has(startNode)) {
        visitedOrder.innerHTML = "Không có đường đi.";
        toggleInputs(false);
        return;
    }

    let dist = {};
    let prev = {};
    let queue = new MinHeap();
    let pathEdges = [];

    allNodes.forEach(node => {
        dist[node] = Infinity;
        prev[node] = null;
    });

    dist[startNode] = 0;
    queue.push(startNode, 0);

    visitedOrder.innerHTML = "";
    toggleInputs(true);
    cy.getElementById(startNode.toString()).style("background-color", "#52b788");

    let found = false;

    while (!queue.isEmpty()) {
        if (isStopped) return;

        let { node: u, cost } = queue.pop();
        if (u === endNode) {
            found = true;
            cy.getElementById(endNode.toString()).style("background-color", "#52b788");
            break;
        }

        if (u !== startNode) {
            cy.getElementById(u.toString()).style("background-color", "#ef476f");
        }

        if (graph[u]) {
            for (let { node: v, weight } of graph[u]) {
                let newDist = dist[u] + weight;
                if (newDist < dist[v]) {
                    dist[v] = newDist;
                    prev[v] = u;
                    queue.update(v, newDist);
                }
            }
        }

        await new Promise(resolve => setTimeout(resolve, delay));
    }

    if (found) {
        await highlightShortestPathEdges(prev, startNode, endNode, delay);

        let path = [];
        for (let at = endNode; at !== null; at = prev[at]) {
            path.push(at);
        }
        path.reverse();

        visitedOrder.innerHTML += path.join(" -> ");
    } else {
        visitedOrder.innerHTML = "Không có đường đi.";
    }

    toggleInputs(false);
}

async function highlightShortestPathEdges(prev, startNode, endNode, delay) {
    let path = [];
    for (let at = endNode; at !== null; at = prev[at]) {
        path.push(at);
    }
    if (isStopped) return;
    path.reverse();

    let seenEdges = new Set();
    const graphType = document.querySelector('input[name="graphType"]:checked').value;

    for (let i = 1; i < path.length; i++) {
        let from = path[i - 1];
        let to = path[i];

        let minWeight = Infinity;
        let minEdge = null;

        cy.edges().forEach(edge => {
            let edgeSource = edge.source().id();
            let edgeTarget = edge.target().id();
            let weight = edge.data('weight');

            if (edgeSource === from.toString() && edgeTarget === to.toString() && graphType === 'directed') {
                if (weight < minWeight && !seenEdges.has(edge.id())) {
                    minWeight = weight;
                    minEdge = edge;
                }
            }
            else if ((edgeSource === from.toString() && edgeTarget === to.toString() && graphType === 'undirected') ||
            (edgeSource === to.toString() && edgeTarget === from.toString() && graphType ==='undirected')) {
                if (weight < minWeight && !seenEdges.has(edge.id())) {
                    minWeight = weight;
                    minEdge = edge;
                }
            }
        });

        if (minEdge) {
            minEdge.style("line-color", "#c9184a");
            seenEdges.add(minEdge.id());
        }

        await new Promise(resolve => setTimeout(resolve, delay));
    }
}



class MinHeap {
    constructor() {
        this.heap = [];
    }

    push(node, cost) {
        this.heap.push({ node, cost });
        this.heap.sort((a, b) => a.cost - b.cost);
    }

    pop() {
        return this.heap.shift();
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    update(node, cost) {
        let found = this.heap.findIndex(item => item.node === node);
        if (found !== -1) {
            this.heap[found].cost = cost;
        } else {
            this.push(node, cost);
        }
        this.heap.sort((a, b) => a.cost - b.cost);
    }
}

async function reconstructPath(prev, startNode, endNode) {
    if (isStopped) return;
    let path = [];
    for (let at = endNode; at !== null; at = prev[at]) {
        path.push(at);
    }
    path.reverse();

    document.getElementById("visitedOrder").innerHTML = "";

    for (let i = 0; i < path.length; i++) {
        let node = path[i];

        document.getElementById("visitedOrder").innerHTML += (i === 0) ? `${node}` : ` -> ${node}`;

        if (i > 0) {
            let from = path[i - 1];
            let to = node;
            //to mau cung duong di
            cy.edges().forEach(edge => {
                if (edge.source().id() == from && edge.target().id() == to) {
                    edge.style("line-color", "#c9184a");
                }
            });
        }
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}


// DO THI PHAN DOIIIIIIIIIIIIIIII
async function checkBipartite() {
    const inputText = document.getElementById('graphInput').value.trim();
    const lines = inputText.split('\n');
    let graph = {};

    const graphType = document.querySelector('input[name="graphType"]:checked').value;
    if (isStopped) return;

    lines.forEach(line => {
        const edgeData = line.split(' ').map(Number);
        if (isStopped) return;

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
    const startNode = parseInt(document.getElementById('startNodeInput').value);
    if (!graph[startNode] || graph[startNode].length === 0) {
        cy.$(`#${startNode}`).style('background-color', colors.gray);
        document.getElementById('visitedOrder').innerText = "Đồ thị không phân đôi.";
        return;
    }
    await bfsCheckBipartite(graph);
}

async function bfsCheckBipartite(graph) {
    const queue = [];
    const visited = new Set();
    const group = new Map();
    // const delay = parseInt(document.getElementById('speedSlider').value);
    const startNode = parseInt(document.getElementById('startNodeInput').value);


    queue.push(startNode);
    visited.add(startNode);
    group.set(startNode, 1);

    cy.$(`#${startNode}`).style('background-color', colors.red); // Đỉnh bắt đầu duyệt mặc định đỏ

    while (queue.length > 0) {
        if (isStopped) return;
        const node = queue.shift();

        if (graph[node]) {
            for (const neighbor of graph[node]) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);

                    group.set(neighbor, group.get(node) === 1 ? 2 : 1);

                    if (group.get(neighbor) === 1) {
                        cy.$(`#${neighbor}`).style('background-color', colors.red);
                    } else {
                        cy.$(`#${neighbor}`).style('background-color', colors.blue);
                    }

                    queue.push(neighbor);
                } else {
                    if (group.get(neighbor) === group.get(node)) {
                        cy.elements().forEach(ele => {
                            ele.style('background-color', colors.gray);
                        });
                        document.getElementById('visitedOrder').innerText += "Đồ thị không phân đôi.";
                        return;
                    }
                }
            }
        }

        // await new Promise(resolve => setTimeout(resolve, delay));
    }
    const isBipartite = Array.from(group.values()).every(g => g === 1 || g === 2);
    if (isBipartite) {
        document.getElementById('visitedOrder').innerText += "Đồ thị phân đôi";
    } else {
        document.getElementById('visitedOrder').innerText += "Đồ thị không phân đôi.";
    }
}


// TARJANNNNNNNNNNNNNNNNNNN
async function performTarjan() {
    toggleInputs(true);
    resetTraversal();

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

    await tarjan(graph);
    toggleInputs(false);
}

async function tarjan(graph) {
    let index = 0;
    let stack = [];
    let lowLink = {};
    let indexMap = {};
    let onStack = {};
    let sccs = [];
    let colorIndex = 0;
    const colorsArray = [
        '#A6B1E1', '#FFB7B2', '#F7D08A', '#9AC2C9', '#D4A5A5',
        '#B0A8B9', '#EEC4C4', '#89A7A7', '#F6AE99', '#C2C5BB',
        '#B8A1C7', '#F3C98B', '#A1C3D1', '#EAB4A2', '#A5C4C9',
        '#D3B1C2', '#90AFC5', '#E6A57E', '#AC92A6', '#C9ADA7',
        '#8DA7BE', '#E8AEB7', '#B5D8CC', '#C6C5B9', '#F4A259',
        '#A2A8D3', '#DBB8A8', '#C1B2AB', '#F3D1A1', '#B4A2A8',
        '#D1A3A6', '#90BAAD', '#E8C1C5', '#A6C7D8', '#DABFAF',
        '#B89F94', '#D3A587', '#A6A5C4', '#E4B7A0', '#C8B4C8',
        '#96C0B7', '#F2A679', '#B6D8A9', '#A4B8C4', '#D7AFAF',
        '#B1C5C8', '#E3B5A4', '#A4A1C5', '#C8A8B7', '#F1B494'
    ];
    
    
    // const delay = parseInt(document.getElementById('speedSlider').value);
    async function strongConnect(node) {
        indexMap[node] = index;
        lowLink[node] = index;
        index++;
        stack.push(node);
        onStack[node] = true;
        if (isStopped) return;
        cy.$(`#${node}`).style('background-color', '');

        for (const neighbor of graph[node]) {
            if (!(neighbor in indexMap)) {
                await strongConnect(neighbor);
                lowLink[node] = Math.min(lowLink[node], lowLink[neighbor]);
            } else if (onStack[neighbor]) {
                lowLink[node] = Math.min(lowLink[node], indexMap[neighbor]);
            }
        }

        if (lowLink[node] === indexMap[node]) {
            let scc = [];
            let w;
            const color = colorsArray[colorIndex % colorsArray.length];

            do {
                w = stack.pop();
                onStack[w] = false;
                scc.push(w);
                cy.$(`#${w}`).style('background-color', color);
                // await new Promise(resolve => setTimeout(resolve, delay)); 
            } while (w !== node);

            sccs.push(scc);
            colorIndex++;
        }
    }

    for (const node in graph) {
        if (!(node in indexMap)) {
            await strongConnect(node);
        }
    }

    sccs = sccs.map(scc => scc.sort((a, b) => a - b));

    let resultText = '';
    // sccs.forEach((scc, index) => {
    //     resultText += `BPLT ${index + 1}: ${scc.join(' ')}\n`;
    // });

    document.getElementById('visitedOrder').innerText = `Số bộ phận liên thông mạnh: ${sccs.length}\n${resultText}`;
}


// KIEM TRA CHU TRINHHHHHHHHHHHHHHHHHHH
async function checkCycle() {
    const inputText = document.getElementById('graphInput').value.trim();
    const lines = inputText.split('\n');
    let graph = {};

    const graphType = document.querySelector('input[name="graphType"]:checked').value;
    const startNode = document.getElementById('startNodeInput').value.trim();
    // const delay = parseInt(document.getElementById('speedSlider').value);

    if (isStopped) return;

    lines.forEach(line => {
        const edgeData = line.split(' ').map(Number);
        if (isStopped) return;

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

    const visited = new Set();
    const inStack = new Set();
    const cycleNodes = new Set();
    const nonCycleNodes = new Set();
    const parentMap = {};

    async function dfs(node, parent) {
        if (isStopped) return false;

        visited.add(node);
        inStack.add(node);

        cy.getElementById(node).style('background-color', colors.gray);
        await delayFunction(delay);
        const neighbors = graph[node].sort((a, b) => a - b);

        for (const neighbor of neighbors) {
            if (isStopped) return false;

            if (!visited.has(neighbor)) {
                parentMap[neighbor] = node;
                const foundCycle = await dfs(neighbor, node);
                if (foundCycle) {
                    return true;
                }
            } else if (inStack.has(neighbor) && neighbor !== parent) {
                let current = node;
                cycleNodes.add(current);
                while (current !== neighbor) {
                    current = parentMap[current];
                    cycleNodes.add(current);
                }
                console.log("parentMap:", JSON.stringify(parentMap, null, 2));
                console.log("Trước khi cập nhật cycleNodes:", [...cycleNodes]);
                cycleNodes.add(neighbor);
                return true;
            }
        }

        inStack.delete(node);
        return false;
    }

    function delayFunction(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    if (graph[startNode]) {
        if (isStopped) return;
        await dfs(Number(startNode), -1);
    }

    for (const node in graph) {
        if (!cycleNodes.has(Number(node)) && !Object.values(parentMap).includes(Number(node))) {
            nonCycleNodes.add(Number(node));
        }
    }

    nonCycleNodes.forEach(node => {
        if (isStopped) return;
        cy.getElementById(node).style('background-color', colors.gray);
    });

    cycleNodes.forEach(node => {
        if (isStopped) return;
        cy.getElementById(node).style('background-color', colors.blue);
    });

    const resultText = cycleNodes.size > 0 ? `Có chu trình` : "Không chứa chu trình";
    document.getElementById('visitedOrder').innerText = resultText;
}

document.getElementById('checkCycleButton').addEventListener('click', async () => {
    await checkCycle();
});


// TopoSorttttttttttttttttttttttttttttt
async function performTopoSort() {
    toggleInputs(true);
    resetTraversal();

    const nodes = cy.nodes();
    const edges = cy.edges();

    let adjList = {};
    let inDegree = {};

    nodes.forEach(node => {
        adjList[node.id()] = [];
        inDegree[node.id()] = 0;
    });

    edges.forEach(edge => {
        const source = edge.source().id();
        const target = edge.target().id();
        adjList[source].push(target);
        inDegree[target]++;
    });

    let queue = [];
    let result = [];

    nodes.forEach(node => {
        if (inDegree[node.id()] === 0) {
            queue.push(node.id());
        }
    });

    while (queue.length > 0) {
        if (isStopped) break;

        let node = queue.shift();
        result.push(node);

        const neighbors = adjList[node].sort((a, b) => parseInt(a) - parseInt(b));

        for (let neighbor of neighbors) {
            inDegree[neighbor]--;

            if (inDegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }

        let cyNode = cy.getElementById(node);
        cyNode.style("background-color", colors.bettergreen);
        document.getElementById("visitedOrder").innerText += " " + node;

        await new Promise(resolve => setTimeout(resolve, delay));
    }

    if (result.length !== nodes.length && !isStopped) {
        // console.log("Có chu trình trong đồ thị!");
        document.getElementById("visitedOrder").innerText = "Có chu trình! Nhập lại";
    }

    document.getElementById("graphInput").disabled = false;
    document.getElementById("creatGraph").disabled = false;
    document.getElementById("traversalType").disabled = false;
    document.getElementById("startNodeInput").disabled = false;
    document.getElementById("endNodeInput").disabled = false;

}


//BellmanFordddddddddddddd
async function bellmanFord() {
    const startNode = parseInt(document.getElementById("startNodeInput").value);
    const endNode = parseInt(document.getElementById("endNodeInput").value);
    const visitedOrder = document.getElementById("visitedOrder");
    // const speedSlider = document.getElementById("speedSlider");
    const graphType = document.querySelector('input[name="graphType"]:checked').value;

    if (isNaN(startNode) || isNaN(endNode)) {
        visitedOrder.innerHTML = "Vui lòng nhập đỉnh hợp lệ.";
        return;
    }
    if (isStopped) return;

    const inputText = document.getElementById("graphInput").value.trim();
    const lines = inputText.split("\n");
    let graph = {};
    let allNodes = new Set();

    for (let line of lines) {
        if (isStopped) return;
        const [u, v, w] = line.split(" ").map(Number);
        if (w == null) {
            visitedOrder.innerHTML = "Vui lòng nhập trọng số.";
            toggleInputs(false);
            return;
        }
        if (u == v) continue;
        if (!graph[u]) graph[u] = [];
        graph[u].push({ node: v, weight: w });
        if (graphType === 'undirected') {
            if (!graph[v]) graph[v] = [];
            graph[v].push({ node: u, weight: w });
        }

        allNodes.add(u);
        allNodes.add(v);
    }

    if (!allNodes.has(endNode) || !allNodes.has(startNode)) {
        visitedOrder.innerHTML = "Không có đường đi.";
        toggleInputs(false);
        return;
    }

    let dist = {};
    let prev = {};
    allNodes.forEach(node => {
        dist[node] = Infinity;
        prev[node] = null;
    });

    dist[startNode] = 0;

    let hasNegativeCycle = false;

    for (let i = 0; i < allNodes.size - 1; i++) {
        cy.getElementById(startNode.toString()).style("background-color", colors.green);
        let updated = false;
        for (let u of allNodes) {
            if (graph[u]) {
                for (let { node: v, weight } of graph[u]) {
                    if (dist[u] + weight < dist[v]) {
                        dist[v] = dist[u] + weight;
                        prev[v] = u;
                        updated = true;
                        if (u !== startNode && u !== endNode) {
                            cy.getElementById(u.toString()).style("background-color", colors.red);
                            await new Promise(resolve => setTimeout(resolve, delay)); // Thêm delay để tô màu từ từ
                        }
                    }
                    if (isStopped) break;

                }
            }
            if (isStopped) break;
        }
        // Nếu không có cập nhật nào, thoát vòng lặp luôn cho nóng
        if (!updated) break;
        if (isStopped) break;
    }

    // Kiểm tra chu trình trọng số âm
    for (let u of allNodes) {
        if (graph[u]) {
            for (let { node: v, weight } of graph[u]) {
                if (dist[u] + weight < dist[v]) {
                    hasNegativeCycle = true;
                    break;
                }
            }
        }
        if (hasNegativeCycle) break;
    }
    if(!isStopped){
        if (hasNegativeCycle) {
            visitedOrder.innerHTML = "Đồ thị chứa chu trình trọng số âm.";
        } else if (dist[endNode] === Infinity) {
            visitedOrder.innerHTML = "Không có đường đi.";
        } else {
            cy.getElementById(endNode.toString()).style("background-color", colors.green);
            await highlightShortestPathEdges(prev, startNode, endNode, delay);
            let path = [];
            for (let at = endNode; at !== null; at = prev[at]) {
                path.push(at);
            }
            path.reverse();
            visitedOrder.innerHTML += path.join(" -> ");
        }
    }


    toggleInputs(false);
}

// Xếp hạng đồ thịiiiiiiiiiiiii
function makeNull() {
    return [];
}

function pushBack(list, value) {
    list.push(value);
}

function elementAt(list, i) {
    return list[i - 1];
}

function copyList(list1, list2) {
    list1.length = 0;
    list1.push(...list2);
}

async function performRanked() {
    toggleInputs(true);
    resetTraversal();

    const nodes = cy.nodes();
    const edges = cy.edges();

    let adjList = {};
    let d = {};
    let r = {};
    nodes.forEach(node => {
        d[node.id()] = 0;
        r[node.id()] = -1;
        adjList[node.id()] = [];
    });
    edges.forEach(edge => {
        const source = edge.source().id();
        const target = edge.target().id();
        adjList[source].push(target);
        d[target]++;
    });
    let S1 = makeNull();
    nodes.forEach(node => {
        if (d[node.id()] === 0) {
            pushBack(S1, node.id());
        }
    });

    let k = 0;
    let hasCycle = false; // Biến cờ để kiểm tra chu trình
    let result = [];

    while (S1.length > 0) {
        if(isStopped) break;
        let S2 = makeNull();

        for (let i = 0; i < S1.length; i++) {
            if(isStopped) break;
            const u = elementAt(S1, i + 1);
            r[u] = k;
            adjList[u].forEach(v => {
                d[v]--;
                if (d[v] === 0) {
                    pushBack(S2, v);
                }
            });

            let cyNode = cy.getElementById(u);
            cyNode.style("background-color", colors.bettergreen);

            result.push({ node: u, rank: r[u] });
            document.getElementById("visitedOrder").innerText = result.map(item => `${item.node}[${item.rank}]`).join(", ");

            await new Promise(resolve => setTimeout(resolve, delay));
        }

        copyList(S1, S2);
        k++;
    }

    // Kiểm tra nếu có chu trình
    nodes.forEach(node => {
        if(isStopped) return;
        if (d[node.id()] > 0) {
            hasCycle = true;
        }
    });

    if (hasCycle) {
        document.getElementById("visitedOrder").innerText = "Có chu trình! Nhập lại!";
    }

    toggleInputs(false);
}

// BFS full do thiiiiiiiiiiiiiii
async function performBFSFull() {
    let queue = [];
    let visited = new Set();
    // let delay = document.getElementById("speedSlider").value; 
    let nodes = cy.nodes().map(n => n.id()).sort((a, b) => a - b); 
    let startNode = document.getElementById("startNodeInput").value;

    const graphType = document.querySelector('input[name="graphType"]:checked').value;
    const isDirected = (graphType === "directed"); 

    resetTraversal();

    async function bfs(start) {
        queue.push(start);

        while (queue.length > 0) {
            if (isStopped) return;

            let current = queue.shift();
            if (visited.has(current)) continue;

            visited.add(current);
            cy.getElementById(current).style("background-color", colors.red);
            document.getElementById("visitedOrder").innerText += " " + current;

            await new Promise(resolve => setTimeout(resolve, delay));

            let neighbors;
            if (isDirected) {
                neighbors = cy.getElementById(current).outgoers("node")
                    .filter(n => !visited.has(n.id()))
                    .map(n => n.id());
            } else {
                neighbors = cy.getElementById(current).neighborhood("node")
                    .filter(n => !visited.has(n.id()))
                    .map(n => n.id());
            }

            neighbors.sort((a, b) => b - a); 
            queue.push(...neighbors);
        }
    }

    if (cy.getElementById(startNode).length > 0) {
        await bfs(startNode);
    }

    for (let u of nodes) {
        if (!visited.has(u)) {
            await bfs(u);
        }
    }

    enableInputs();
}

async function performDFSFull() {
    let stack = [];
    let visited = new Set();
    // let delay = document.getElementById("speedSlider").value; 
    let nodes = cy.nodes().map(n => n.id()).sort((a, b) => a - b); 
    let startNode = document.getElementById("startNodeInput").value;

    const graphType = document.querySelector('input[name="graphType"]:checked').value;
    const isDirected = (graphType === "directed"); 

    resetTraversal();

    async function dfs(start) {
        stack.push(start);

        while (stack.length > 0) {
            if (isStopped) return;

            let current = stack.pop();
            if (visited.has(current)) continue;

            visited.add(current);
            cy.getElementById(current).style("background-color", colors.blue);
            document.getElementById("visitedOrder").innerText += " " + current;

            await new Promise(resolve => setTimeout(resolve, delay));

            let neighbors;
            if (isDirected) {
                neighbors = cy.getElementById(current).outgoers("node")
                    .filter(n => !visited.has(n.id()))
                    .map(n => n.id());
            } else {
                neighbors = cy.getElementById(current).neighborhood("node")
                    .filter(n => !visited.has(n.id()))
                    .map(n => n.id());
            }

            neighbors.sort((a, b) => b - a); 
            stack.push(...neighbors);
        }
    }

    if (cy.getElementById(startNode).length > 0) {
        await dfs(startNode);
    }

    for (let u of nodes) {
        if (!visited.has(u)) {
            await dfs(u);
        }
    }

    enableInputs();
}

async function performDFSRecursionFull() {
    let visited = new Set();
    // let delay = document.getElementById("speedSlider").value;
    let nodes = cy.nodes().map(n => n.id()).sort((a, b) => a - b);
    let startNode = document.getElementById("startNodeInput").value;

    const graphType = document.querySelector('input[name="graphType"]:checked').value;
    const isDirected = (graphType === "directed");

    resetTraversal();

    async function dfsRecursionFull(node) {
        if (isStopped) return;
        if (visited.has(node)) return;

        visited.add(node);
        cy.getElementById(node).style("background-color", colors.green);
        document.getElementById("visitedOrder").innerText += " " + node;

        await new Promise(resolve => setTimeout(resolve, delay));

        let neighbors;
        if (isDirected) {
            neighbors = cy.getElementById(node).outgoers("node")
                .filter(n => !visited.has(n.id()))
                .map(n => n.id());
        } else {
            neighbors = cy.getElementById(node).neighborhood("node")
                .filter(n => !visited.has(n.id()))
                .map(n => n.id());
        }

        neighbors.sort((a, b) => a - b);

        for (let neighbor of neighbors) {
            await dfsRecursionFull(neighbor);
        }
    }

    if (cy.getElementById(startNode).length > 0) {
        await dfsRecursionFull(startNode);
    }

    for (let u of nodes) {
        if (!visited.has(u)) {
            await dfsRecursionFull(u);
        }
    }

    enableInputs();
}

// Kruskalllllllllllll
async function Kruskal() {
    const visitedOrder = document.getElementById("visitedOrder");
    const inputText = document.getElementById("graphInput").value.trim();
    const lines = inputText.split("\n");
    let edges = [];
    let allNodes = new Set();

    for (let line of lines) {
        const [u, v, w] = line.split(" ").map(Number);
        if (w == null) {
            visitedOrder.innerHTML = "Vui lòng nhập trọng số.";
            toggleInputs(false);
            return;
        }
        if (w < 0) {
            visitedOrder.innerHTML = "Trọng số là số không âm.";
            toggleInputs(false);
            return;
        }
        edges.push({ u, v, w });
        allNodes.add(u);
        allNodes.add(v);
    }

    const components = getConnectedComponents(allNodes, edges);
    let mstResults = [];
    
    for (let component of components) {
        let mstEdges = [];
        let totalWeight = 0;
        
        let parent = {};
        let rank = {};

        for (let node of component) {
            parent[node] = node;
            rank[node] = 0;
        }

        function find(u) {
            if (parent[u] !== u) {
                parent[u] = find(parent[u]);
            }
            return parent[u];
        }

        function union(u, v) {
            const rootU = find(u);
            const rootV = find(v);

            if (rootU !== rootV) {
                if (rank[rootU] > rank[rootV]) {
                    parent[rootV] = rootU;
                } else if (rank[rootU] < rank[rootV]) {
                    parent[rootU] = rootV;
                } else {
                    parent[rootV] = rootU;
                    rank[rootU]++;
                }
            }
        }

        edges.sort((a, b) => a.w - b.w);

        let seenEdges = new Set();

        for (let { u, v, w } of edges) {
            if (isStopped) {
                resetTraversal();
                return;
            }

            if (component.includes(u) && component.includes(v) && find(u) !== find(v)) {
                mstEdges.push({ u, v, w });
                totalWeight += w;
                union(u, v);

                cy.nodes(`#${u}`).style("background-color", colors.green); 
                cy.nodes(`#${v}`).style("background-color", colors.green); 
                let minWeight = Infinity;
                let minEdge = null;

                cy.edges().forEach(edge => {
                    let edgeSource = edge.source().id();
                    let edgeTarget = edge.target().id();
                    let weight = edge.data('weight');

                    if ((edgeSource === u.toString() && edgeTarget === v.toString()) || 
                        (edgeSource === v.toString() && edgeTarget === u.toString())) {
                        
                        if (weight < minWeight && !seenEdges.has(edge.id())) {
                            minWeight = weight;
                            minEdge = edge;
                        }
                    }
                });

                if (minEdge) {
                    minEdge.style("line-color", colors.red); 
                    seenEdges.add(minEdge.id()); 
                }
                
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        mstResults.push(totalWeight); 
    }

    mstResults.forEach((weight, index) => {
        visitedOrder.innerHTML += `Trọng lượng cây khung ${index + 1}: ${weight}<br>`;
    });

    toggleInputs(false);
}

function getConnectedComponents(nodes, edges) {
    const visited = new Set();
    const components = [];
    
    const adjList = {};
    nodes.forEach(node => adjList[node] = []);
    edges.forEach(({ u, v }) => {
        adjList[u].push(v);
        adjList[v].push(u);
    });

    function dfs(node, component) {
        visited.add(node);
        component.push(node);
        adjList[node].forEach(neighbor => {
            if (!visited.has(neighbor)) {
                dfs(neighbor, component);
            }
        });
    }

    nodes.forEach(node => {
        if (!visited.has(node)) {
            let component = [];
            dfs(node, component);
            components.push(component);
        }
    });

    return components;
}

function isConnected(nodes) {
    const parent = {};
    const find = (u) => {
        if (parent[u] !== u) parent[u] = find(parent[u]);
        return parent[u];
    };
    const union = (u, v) => {
        const rootU = find(u);
        const rootV = find(v);
        if (rootU !== rootV) parent[rootV] = rootU;
    };

    for (let node of nodes) {
        parent[node] = node;
    }

    const edges = document.getElementById("graphInput").value.trim().split("\n");
    for (let edge of edges) {
        const [u, v] = edge.split(" ").map(Number);
        union(u, v);
    }

    const roots = new Set();
    for (let node of nodes) {
        roots.add(find(node));
    }

    return roots.size === 1;
}


