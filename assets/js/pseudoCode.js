
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
        "bfsfull": `Đưa các đỉnh chưa duyệt vào hàng đợi, lặp lại BFS cho từng thành phần liên thông.`,
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
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;p[v] = u<br>`,
        "bipartite": `Khởi tạo mảng màu -1<br>
 Duyệt i: nếu chưa tô && !bfs(i) → FALSE<br>
 Trả về TRUE;<br>
 Đưa u vào Hàng đợi, tô Xanh (0)<br>
 while (!Hàng đợi rỗng) {<br>
 &nbsp;&nbsp;&nbsp;&nbsp;Lấy u, duyệt kề v:<br>
 &nbsp;&nbsp;&nbsp;&nbsp;if (v chưa tô) tô đối lập, đẩy vào Hàng đợi;<br>
 &nbsp;&nbsp;&nbsp;&nbsp;if (color[v] == color[u]) → FALSE;<br>
 }<br>
 Trả về TRUE;`,
        "Tarjan": `Khởi tạo num, low = -1, stack rỗng  <br>
 Duyệt i: nếu chưa thăm → Tarjan(i)  <br>
 Tarjan(u):  <br>
 &nbsp;&nbsp;&nbsp;&nbsp;Gán num[u] = low[u] = ++index, đẩy vào stack   <br>
 &nbsp;&nbsp;&nbsp;&nbsp;Duyệt kề v:  <br>
 &nbsp;&nbsp;&nbsp;&nbsp;if (v chưa thăm) Tarjan(v), cập nhật low[u]  <br>
 &nbsp;&nbsp;&nbsp;&nbsp;if (v trong stack) cập nhật low[u]  <br>
 &nbsp;&nbsp;&nbsp;&nbsp;if (num[u] == low[u]) → pop stack tạo SCC  <br>
 `,
        "Circled":
 `**Khởi tạo:**<br>
 &nbspo: &nbsp;&nbsp;&nbsp;&nbsp;Đánh dấu tất cả đỉnh là chưa thăm (visited[u] = false)<br>ếp &nbsp;&nbsp;&nbsp;&nbsp;Tạo recStack để theo dõi đỉnh trong ngăn xếp đệ quy<br>đệ  t **Kiểm tra chu trình:**<br>;for mỗi đỉnh u chưa thăm:<br>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if DFS(u) trả về true then<br>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kết luận: "Có chu trình"<br>
 
 **Hàm DFS(u):**<br>
 &nbsp;&nbsp;&nbsp;&nbsp;Đánh dấu visited[u] = true, recStack[u] = true<br>
 &nbsp;&nbsp;&nbsp;&nbsp;for mỗi đỉnh kề v của u:<br>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if v chưa thăm và DFS(v) == true then return true<br>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if recStack[v] == true then return true<br>
 &nbsp;&nbsp;&nbsp;&nbsp;Đánh dấu recStack[u] = false<br>
 &nbsp;&nbsp;&nbsp;&nbsp;return false<br>
 
 **Kết luận:**<br>
 &nbsp;&nbsp;&nbsp;&nbsp;Nếu không có chu trình, trả về "Không chứa chu trình"<br>
 
 `,
        "topoSort":
 `Khởi tạo adjList,
 `,
        "topoSort":
 `Khởi tạo adjList, inDegree<br>
 for mỗi đỉnh u trong nodes:<br>
 &nbsp;&nbsp;&nbsp;&nbsp;adjList[u] = [], inDegree[u] = 0<br>
 
 for mỗi cạnh (u → v) trong edges:<br>
 &nbsp;&nbsp;&nbsp;&nbsp;Thêm v vào adjList[u]<br>
 &nbsp;&nbsp;&nbsp;&nbsp;Tăng inDegree[v]<br>
 
 Khởi tạo queue = []<br>
 for mỗi u trong nodes:<br>
 &nbsp;&nbsp;&nbsp;&nbsp;if inDegree[u] == 0 then queue.push(u)<br>
 
 Khởi tạo result = []<br>
 while queue không rỗng:<br>
 &nbsp;&nbsp;Lấy node = queue.shift()<br>
 &nbsp;&nbsp;Thêm node vào result<br>
 
 &nbsp;&nbsp;for mỗi neighbor của node:<br>
 &nbsp;&nbsp;&nbsp;&nbsp;Giảm inDegree[neighbor]<br>
 &nbsp;&nbsp;&nbsp;&nbsp;if inDegree[neighbor] == 0 then queue.push(neighbor)<br>
 
 if result.length != nodes.length:<br>
 &nbsp;&nbsp;return "Có chu trình trong đồ thị!"<br>
 else:<br>
 &nbsp;&nbsp;return result<br>`,
 
        "bellmanFord":
 `Khởi tạo khoảng cách dist với tất cả các đỉnh:<br>
 &nbsp;&nbsp;&nbsp; i từ 0 đến V-1: dist[i] = Infinity<br>
 Đặt dist[src] = 0<br>
 for i từ 1 đến V-1:<br>
 &nbsp;&nbsp;&nbsp; mỗi cạnh (u, v, w) trong graph:<br>
 &nbsp;&nbsp;&nbsp;&nbsp;if dist[u] + w < dist[v]:<br>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dist[v] = dist[u] + w<br>
 
 for mỗi cạnh (u, v, w) trong graph:<br>
 &nbsp;&nbsp;&nbsp;&nbsp;if dist[u] + w < dist[v]:<br>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return "Đồ thị chứa chu trình âm"<br>
 
 Kết luận:<br>
 Nếu không có chu trình âm, trả về dist (mảng khoảng cách ngắn nhất).<br>`,
        "ranked":
 `&nbsp;&nbsp;Khởi tạo d[u] = bậc vào của u <br>
 &nbsp;&nbsp;S[0] = tập các đỉnh có d[u] = 0<br>
 &nbsp;&nbsp;k = 0<br>
 &nbsp;&nbsp;trong khi S[k] không rỗng:<br>
 &nbsp;&nbsp;&nbsp;&nbsp;S[k+1] = []<br>
 &nbsp;&nbsp;&nbsp;&nbsp;mỗi u trong S[k]:<br>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rank[u] = k<br>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mỗi v kề u:<br>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d[v]--<br>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nếu d[v] == 0:<br>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;đưa v vào S[k+1]<br>
 &nbsp;&nbsp;&nbsp;&nbsp;k++<br></br>`,
        "kruskal":
 `Khởi tạo:<br>
&nbsp;&nbsp;&nbsp;T = ∅ // Cây khung nhỏ nhất ban đầu rỗng <br>
&nbsp;&nbsp;&nbsp;Sắp xếp tất cả các cung (u, v) theo trọng số tăng dần<br>
&nbsp;&nbsp;&nbsp;Mỗi đỉnh ban đầu là một tập riêng biệt (makeSet(n))<br>
<br>
&nbsp;&nbsp;&nbsp;Lặp qua từng cung (u, v) theo thứ tự đã sắp xếp:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Nếu findSet(u) ≠ findSet(v): // Nếu u và v thuộc hai tập hợp khác nhau<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Thêm cung (u, v) vào T<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hợp nhất hai tập chứa u và v (unionSet(u, v))<br>
&nbsp;&nbsp;&nbsp;Nếu số cung trong T đạt n - 1: // Nếu đủ n - 1 cạnh thì dừng<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dừng vòng lặp<br>
&nbsp;&nbsp;&nbsp;Trả về T // Cây khung nhỏ nhất`,
 "prim":
 ` Khởi tạo:<br>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tất cả các đỉnh đều chưa đánh dấu<br>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Với mọi u != s, 𝜋[u] = oo<br>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;𝜋[s] = 0<br>
&nbsp;&nbsp;Lặp i từ 1 đến n - 1:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tìm u chưa đánh dấu có 𝜋[u] nhỏ nhất.<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Đánh dấu u<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Xét các đỉnh kề v của u, nếu v chưa đánh dấu và (𝜋[u] + trọng số cung (u,v) < 𝜋[v]) thì cập nhật:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;𝜋[v] = trọng số cung (u, v)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;p[v] = u`,
 
};
 
     selectElement.addEventListener("change", function () {
         const selectedAlgorithm = this.value;
         pseudoCodeContainer.innerHTML = pseudoCodeMap[selectedAlgorithm] || "Mã giả tại đây";
     });
 
     selectElement.dispatchEvent(new Event("change"));
 });