//Loading animation
window.addEventListener("load", function () {
    let loadingScreen = document.getElementById("loading-screen");

    setTimeout(() => {
        loadingScreen.style.transition = "opacity 0.6s ease";
        loadingScreen.style.opacity = "0";
    }, 200);

    setTimeout(() => {
        loadingScreen.style.display = "none";
    }, 600);
});

//Change Theme
const themeToggle = document.querySelector(".themeInp");

themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('light_theme_var');
})

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
                    'text-halign': 'center' 
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

document.addEventListener("DOMContentLoaded", function () {
    const selectElement = document.getElementById("traversalType");
    const pseudoCodeContainer = document.querySelector(".fakeLang p");

    const pseudoCodeMap = {
        bfs: `Đưa 1 đỉnh bất kỳ vào Hàng đợi<br>
while Hàng đợi chưa rỗng {<br>
&nbsp;&nbsp;&nbsp;&nbsp;u = lấy đỉnh ở đầu hàng đợi ra<br>
&nbsp;&nbsp;&nbsp;&nbsp;if (u đã duyệt) continue;<br>
&nbsp;&nbsp;&nbsp;&nbsp;Duyệt u<br>
&nbsp;&nbsp;&nbsp;&nbsp;Đánh dấu u đã được duyệt<br>
&nbsp;&nbsp;&nbsp;&nbsp;for các đỉnh kề v của u {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if v chưa được duyệt<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Đưa v vào hàng đợi<br>
&nbsp;&nbsp;&nbsp;&nbsp;}<br>
}`,
        "bfs-fullGraph": `Đưa các đỉnh chưa duyệt vào hàng đợi, lặp lại BFS cho từng thành phần liên thông.`,
        dfs: `Đưa 1 đỉnh bất kỳ vào Ngăn xếp<br>
while Ngăn xếp chưa rỗng {<br>
&nbsp;&nbsp;&nbsp;&nbsp;u = lấy đỉnh ở đỉnh ngăn xếp ra<br>
&nbsp;&nbsp;&nbsp;&nbsp;if (u đã duyệt) continue;<br>
&nbsp;&nbsp;&nbsp;&nbsp;Duyệt u<br>
&nbsp;&nbsp;&nbsp;&nbsp;Đánh dấu u đã được duyệt<br>
&nbsp;&nbsp;&nbsp;&nbsp;for các đỉnh kề v của u (duyệt ngược) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if v chưa được duyệt<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Đưa v vào ngăn xếp<br>
&nbsp;&nbsp;&nbsp;&nbsp;}<br>
}`,
        "dfs-fullGraph": `Lặp lại DFS cho từng thành phần liên thông, dùng ngăn xếp.`,
        "dfs-recursion": `Hàm DFS(u):<br>
&nbsp;&nbsp;&nbsp;&nbsp;if (u đã được duyệt) return;<br>
&nbsp;&nbsp;&nbsp;&nbsp;Duyệt u;<br>
&nbsp;&nbsp;&nbsp;&nbsp;Đánh dấu u đã được duyệt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;for các đỉnh kề v của u {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DFS(v);<br>
&nbsp;&nbsp;&nbsp;&nbsp;}<br><br>
Gọi DFS(startNode);`,
        "dfs-recursion-fullGraph": `Lặp lại DFS cho từng thành phần liên thông, dùng đệ quy.`,
        "mooreDijkstra": `**Khởi tạo:<br>
&nbsp;&nbsp;&nbsp;&nbsp;Tất cả các đỉnh đều chưa đánh dấu<br>
&nbsp;&nbsp;&nbsp;&nbsp;Với mọi u ≠ s, 𝜋[u] = ∞, 𝜋[s] = 0<br>
**Lặp i từ 1 đến n - 1:<br>
&nbsp;&nbsp;&nbsp;&nbsp;Tìm u chưa đánh dấu có 𝜋[u] nhỏ nhất<br>
&nbsp;&nbsp;&nbsp;&nbsp;Đánh dấu u<br>
&nbsp;&nbsp;&nbsp;&nbsp;for các đỉnh kề v của u:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if v chưa đánh dấu và (𝜋[u] + trọng số (u,v) < 𝜋[v]) then<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;𝜋[v] = 𝜋[u] + trọng số (u, v)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;p[v] = u<br>`
    };

    selectElement.addEventListener("change", function () {
        const selectedAlgorithm = this.value;
        pseudoCodeContainer.innerHTML = pseudoCodeMap[selectedAlgorithm] || "Mã giả tại đây";
    });

    selectElement.dispatchEvent(new Event("change"));
});

//an endNodeInput
document.addEventListener("DOMContentLoaded", function () {
    const traversalSelect = document.getElementById("traversalType");
    const endNodeInputGroup = document.querySelector(".pointEnd");

    // Mặc định ẩn endNodeInput
    endNodeInputGroup.style.display = "none";

    traversalSelect.addEventListener("change", function () {
        if (this.value === "mooreDijkstra") {
            endNodeInputGroup.style.display = "flex";
        } else {
            endNodeInputGroup.style.display = "none";
        }
    });
});
