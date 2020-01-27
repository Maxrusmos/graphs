window.onload = function() {
  document.getElementById('load_unload_graph').innerHTML = 'Unloaded graph'; 
  document.getElementById('dir_undir_graph').innerHTML = 'Undirected graph'; 
  let tabs_elements = document.getElementsByClassName('tab_numer');
  document.getElementById('tips_div').style.display = 'none';

  let l_ops = document.getElementsByClassName('b_op');
  for (let i = 0; i < l_ops.length; i++){
    l_ops[i].addEventListener('click', logic_operations);
  }

  tabs_elements[0].style.backgroundColor = 'white';
  tabs_elements[0].style.color = 'black';
  tabs_elements[0].style.border = '1px solid #C0C0C0';
  tabs_elements[0].style.borderBottom = '1px solid white';

  let adj_matrix_class = document.getElementsByClassName('adj_matrix_class');
  let adj_matrix_class_btn = document.getElementsByClassName('add_matrix_btn');
  let inc_matrix_class = $('.inc_matrix_class');
  let hr_class = document.getElementsByClassName('hr_class');
  adj_matrix_class_btn[0].addEventListener('click', add_matrix);
}

let matrix_size = document.getElementsByClassName('size');
let matrix_items_array = document.getElementsByClassName("matrix_item");
let subarray = []; 
let two_matrix = [];
let container = document.getElementById('field'); //поле для отрисовки
let selected_tab = 0;
let from_file_flag = false;
let checked_tab_flag = false;
let prev_size = 0;

var nodes = new vis.DataSet([]);
var edges = new vis.DataSet([]);
var data = {
    nodes: nodes,
    edges: edges
  };

var options = {
  interaction: {
    hover: false
  }, 
  smooth: false,
  physics: false,

  nodes: {
    color: {
      background: 'white',
      border: 'blue',
      highlight: {
        border: 'blue'
      }
    },
    shape: 'circle',
    radius: 20,
    dynamic: false
  },
  edges: {
    color: 'blue',
    width: 0.7
  }
};

var network = new vis.Network(container, data, options);
let flag_newNodes = 1;  
function create_adj_matrix(){ 
  size = matrix_size[selected_tab].value;
  if (size.length != 0){
    let elmtTable1 = document.getElementsByClassName('table_1');
    let tableRows1 = elmtTable1[selected_tab].getElementsByTagName('tr');
    let rowCount1 = tableRows1.length;
    
    for (let i = rowCount1 - 1; i >= 0; i--){
      elmtTable1[selected_tab].removeChild(tableRows1[i]);
    }  
    
    let table1 = document.getElementsByClassName("table_1");
    table1.className = 'table_1';
    let new_table1 = document.createElement("table");
    new_table1.className = "table_1";
    let matrix_div1 = document.getElementsByClassName("adj_matrix_class");
    matrix_div1[selected_tab].appendChild(new_table1);
     
    for (let i = 0; i <= size; i++){
      let add_tr1 = document.createElement('tr');
      table1[selected_tab].appendChild(add_tr1);
      for (let j = 0; j <= size; j++){
        if ((i == 0) && (j == 0)){
          let empty_td1 = document.createElement('td');
          empty_td1.className = "empty";
          add_tr1.appendChild(empty_td1);
        }
        else{
          if (i == 0){
            let add_count_cols_td1 = document.createElement('td');
            add_tr1.appendChild(add_count_cols_td1);
            add_tr1.className = "cols";
            add_count_cols_td1.innerHTML = nodes.get(j - 1).label;
          }
          if (j == 0){
            let add_numeration_td1 = document.createElement('td');
            add_tr1.appendChild(add_numeration_td1);
            add_numeration_td1.className = "rows";
            add_numeration_td1.innerHTML = nodes.get(i - 1).label;
          }
          else if (i != 0) {
            let add_td1 = document.createElement('td');
            add_td1.className = 'td_for_input';
            let add_input1 = document.createElement('input');
            add_input1.className = "matrix_item";
            add_tr1.appendChild(add_td1);
            add_td1.appendChild(add_input1);
          }
        }
      }
    }
    matrix_div1[selected_tab].removeChild(new_table1);
  }
}

function create_inc_matrix(){
  size = matrix_size[selected_tab].value;
  if (size.length != 0){
    let elmtTable2 = document.getElementsByClassName('table_2');
    let tableRows2 = elmtTable2[selected_tab].getElementsByTagName('tr');
    let rowCount2 = tableRows2.length;
    for (let i = rowCount2 - 1; i >= 0; i--) {
      elmtTable2[selected_tab].removeChild(tableRows2[i]);
    }
    let table2 = document.getElementsByClassName("table_2");
    table2.className = 'table_2';
    let new_table2 = document.createElement("table");
    new_table2.className = "table_2";
    table2.className = "table_2";
    let matrix_div2 = document.getElementsByClassName("inc_matrix_class");
    matrix_div2[selected_tab].appendChild(new_table2);

    for (let i = 0; i <= size; i++){
      let add_tr2 = document.createElement('tr');
      table2[selected_tab].appendChild(add_tr2);
      for (let j = 0; j <= counter; j++){
        if ((i == 0) && (j == 0)){
          let empty_td2 = document.createElement('td');
          empty_td2.className = "empty";
          add_tr2.appendChild(empty_td2);
        }
        else{
          if (i == 0){
            let add_count_cols_td2 = document.createElement('td');
            add_tr2.appendChild(add_count_cols_td2);
            add_tr2.className = "cols";
            add_count_cols_td2.className = 'cols_td'
            add_count_cols_td2.innerHTML = edges.get(j - 1).title;
          }
          if (j == 0){
            let add_numeration_td2 = document.createElement('td');
            add_tr2.appendChild(add_numeration_td2);
            add_numeration_td2.className = "rows";
            add_numeration_td2.innerHTML = nodes.get(i - 1).label;
          }
        }
        if ((i != 0) && (j != 0) && (dir_undir_graph_btn.innerHTML == 'Undirected graph') && (load_unload_graph_btn.innerHTML == 'Unloaded graph')){
          let add_td2 = document.createElement('td');
          add_tr2.appendChild(add_td2);
          add_td2.className = 'content_td_inc';
          let edges_connected = network.getConnectedEdges(i - 1).length;
          if (edges_connected == 0) add_td2.innerHTML = 0;
          else{
            for (let k = 0; k < edges_connected; k++){
              if (network.getConnectedEdges(i - 1)[k] == j - 1){
                add_td2.innerHTML = 1;
                break;
              }
              else add_td2.innerHTML = 0;
            }
          }
        }
        if ((i != 0) && (j != 0) && (dir_undir_graph_btn.innerHTML == 'Directed graph') && (load_unload_graph_btn.innerHTML == 'Unloaded graph')){
          let add_td2 = document.createElement('td');
          add_td2.className = 'content_td_inc';
          add_tr2.appendChild(add_td2);
          let edges_connected = network.getConnectedEdges(i - 1).length;
          arrayOfParents = network.getConnectedNodes(i-1, 'from');
          if (edges_connected == 0) add_td2.innerHTML = 0;
          else{
            for (let k = 0; k < edges_connected; k++){
              if (network.getConnectedEdges(i - 1)[k] == j - 1){      
                if (edges.get(j - 1).from === i - 1) add_td2.innerHTML = 1;
                else add_td2.innerHTML = -1
                break;     
              }
              else add_td2.innerHTML = 0;
            }
          }
        }
        if ((i != 0) && (j != 0) && (dir_undir_graph_btn.innerHTML == 'Undirected graph') && (load_unload_graph_btn.innerHTML == 'Loaded graph') ){
          let add_td2 = document.createElement('td');
          add_td2.className = 'content_td_inc';
          add_tr2.appendChild(add_td2);
          let edges_connected = network.getConnectedEdges(i - 1).length;
          if (edges_connected == 0) add_td2.innerHTML = 0;
          else {
            for (let k = 0; k < edges_connected; k++){
              if (network.getConnectedEdges(i - 1)[k] == j - 1){
                add_td2.innerHTML = edges.get(j - 1).label;
                break;
              }
              else add_td2.innerHTML = 0;
            }
          }
        }
         if ((i != 0) && (j != 0) && (dir_undir_graph_btn.innerHTML == 'Directed graph') && (load_unload_graph_btn.innerHTML == 'Loaded graph')){
          let add_td2 = document.createElement('td');
          add_td2.className = 'content_td_inc';
          add_tr2.appendChild(add_td2);
          let edges_connected = network.getConnectedEdges(i - 1).length;
          arrayOfParents = network.getConnectedNodes(i - 1, 'from');
          if (edges_connected == 0) add_td2.innerHTML = 0;
          else{
            for (let k = 0; k < edges_connected; k++){
              if (network.getConnectedEdges(i - 1)[k] == j - 1){ 
                if (edges.get(j - 1).from === i - 1) {
                  add_td2.innerHTML = edges.get(j - 1).label;
                }
                else {
                  add_td2.innerHTML = '-' + edges.get(j - 1).label;
                }
                break;  
              }
              else add_td2.innerHTML = 0;
            }
          }
        }
      }
    }
    matrix_div2[selected_tab].removeChild(new_table2);
  }
}

function sizeble(){
  size = matrix_size[selected_tab].value;
  if (size >= 10){
    document.getElementsByClassName('table_1')[selected_tab].style.removeProperty('height');
    document.getElementsByClassName('table_1')[selected_tab].style.height = '300px'; 
    document.getElementsByClassName('table_2')[selected_tab].style.removeProperty('height');
    document.getElementsByClassName('table_2')[selected_tab].style.height = '300px'; 
    $('.field_for_tabs').height(740 + 'px');
  }
  else if (size.length != 0){
    document.getElementsByClassName('table_1')[selected_tab].style.removeProperty('height');
    document.getElementsByClassName('table_2')[selected_tab].style.removeProperty('height');
    let new_th = $('.to_control_1').height() + $('.to_control_2').height();
    $('.field_for_tabs').height(new_th + 155 + 'px');
  }
}

function add_matrix(){
  size = +matrix_size[selected_tab].value;
  if (size > 50){
    size = 50;
    matrix_size[selected_tab].value = 50;
  }
  if (size.length != 0){
    delete_nodes();
    delete_edges();
    flag_newNodes = 1;
    draw_nodes(); 
    create_adj_matrix();
    if ((!from_file_flag) && (checked_tab_flag == false)){ 
      for (i = 0; i < matrix_items_array.length; i++){
        matrix_items_array[i].value = 0;  
        matrix_items_array[i].addEventListener("keyup", keyup_event);
      }
    }
    else {
      if(!file_vert_flag){
        for (i = 0; i < test_arr.length; i++){
          matrix_items_array[i].value = test_arr[i];
          matrix_items_array[i].addEventListener("keyup", keyup_event);
        }
      }
      else{
        for (i = 0; i < matrix_items_array.length; i++){
          matrix_items_array[i].value = 0;
          matrix_items_array[i].addEventListener("keyup", keyup_event);  
        } 
        file_vert_flag = false;
      }
    }
    for (let i = 0; i < size * size; i++){
      matrix_items_array[i].addEventListener('mouseover', tips_tricks);
    }
    to_double_array(); 
    draw_edges();
    create_inc_matrix();
    saving();
    subarray = [];
  } 
  from_file_flag = false;
  sizeble();
  prev_size = size;
  for (let i = 0; i < matrix_items_array.length; i++){
    matrix_items_array[i].addEventListener('onmousemove', tips_tricks);
    matrix_items_array[i].addEventListener('mouseout', tips_del);
  }
}

function tips_tricks(event){
  size = matrix_size[selected_tab].value;
  let x_coords = event.clientX;
  let y_coords = event.clientY;
  let tips_div = document.getElementById('tips_div');
  let index = $( ".matrix_item" ).index(this);
  let inner = (~~(index / size) + 1) + '-' + ((index % size) + 1)
  tips_div.innerHTML = inner; 
  tips_div.style.position = 'absolute';
  tips_div.style.left = x_coords + 15 + 'px';
  tips_div.style.top = y_coords - 25 + 'px';
  tips_div.style.display = 'block';
}

function tips_del(){
  let tips_div = document.getElementById('tips_div');
  tips_div.style.display = 'none';
}

let check_multi_elem = document.getElementById("check_multi");
function keyup_event(event){
  if (event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 9) 
    return false;
  else{
    if (this.value < 0) {
      this.value = 0;
    }
    if (!isNumeric(this.value)){
      this.value = 0;
    } 
    if ((this.value > 1) && (!(check_multi_elem.checked)) && (load_unload_graph_btn.innerHTML == 'Unloaded graph')) { 
      this.value = 1; 
    }
    if ((this.value > 5) && (check_multi_elem.checked)){ 
      this.value = 5; 
    }
    if ((this.value[0] == 0) && (this.value.length > 1)){ 
      this.value = this.value[1]; 
    }
    to_double_array();
    if (dir_undir_graph_btn.innerHTML == 'Undirected graph' ){
      for (i = 0; i < size; i++)
        for (j = 0; j < size; j++)
          if (subarray[i][j] == this.value) subarray[j][i] = this.value;          
    }
    delete_edges();
    draw_edges();
    create_inc_matrix();
    saving();
    subarray=[];
  }
}

let counter = 0;
function delete_edges(){
  counter--;
  for(let i = 0; i <= counter; i++) network.body.data.edges.remove([i]);       
  counter = 0;   
}

function delete_nodes(){
  size = matrix_size[selected_tab].value;
  for (let i = 0; i < prev_size; i++) network.body.data.nodes.remove({id: i}); 
}

function node_x(it){
  angle = 2 * Math.PI * it / size;
  x_it = 270 * Math.cos(angle);
  return x_it;
}

function node_y(it){
  angle = 2 * Math.PI * it / size;
  y_it = 270 * Math.sin(angle);
  return y_it;
}

function draw_nodes(){
  size = matrix_size[selected_tab].value;
  if (flag_newNodes == 1){
    if(!file_vert_flag){
      for (let i = 0; i < size; i++){
        x_i = node_x(i);
        y_i = node_y(i);
        network.body.data.nodes.add([{id: i, x:x_i, y:y_it, label: '' + (i + 1)}]); 
        array_of_nodesLabels[i] = '' + (i + 1);
      } 
    }
    else{
      for (let i = 0; i < size; i++){
        network.body.data.nodes.add([{id: i, x:x_mas[i], y:y_mas[i], label: '' + name_mas[i]}]); 
        array_of_nodesLabels[i] = '' + name_mas[i];
      } 
      x_mas = [];
      y_mas = [];
      name_mas = [];
    }
  }
  if (flag_newNodes == 0){
    for (let i = 0; i < size; i++){
      x_i = node_x(i);
      y_i = node_y(i);
      network.body.data.nodes.add([{id: i, x:x_i, y:y_i, label: array_of_nodesLabels[i]}]);  
    }
  }
}

function draw_edges(){  
  size = matrix_size[selected_tab].value;  
  for (i = 0; i < size; i++){
    for (j = 0; j < size; j++){
      matrix_items_array[i * size + j].value = subarray[i][j];
    }
  }
  if (dir_undir_graph_btn.innerHTML == 'Undirected graph' && load_unload_graph_btn.innerHTML == 'Unloaded graph' ){
    for (i = 0; i < size; i++){
      for (j = 0; j < size; j++){
        if (i <= j){
          round = 0.0;
          h = 0.1;
          for (let k = 0; k < subarray[i][j]; k++){
            if (subarray[i][j] == 1){
              network.body.data.edges.add([{id: counter, from: i, to: j, smooth: {type: 'curvedCW', roundness: 0.0}, title:'' + nodes.get(i).label+'-'+nodes.get(j).label}]);
              counter++;
            }
           else{
            network.body.data.edges.add([{id: counter, from: i, to: j, smooth: {type: 'curvedCW', roundness: round}, title:''+nodes.get(i).label+'-'+nodes.get(j).label+'('+(k+1)+')'}]);
            counter++; 
            if (k % 2 == 0){
              round = round + h;
            }
            else{
              round = round - h;
            }
            h = h + 0.1;
            }
          }
        }
      }
    }
  }
  else if (dir_undir_graph_btn.innerHTML == 'Directed graph' && load_unload_graph_btn.innerHTML == 'Unloaded graph' ){
    for (i = 0; i < size; i++){
      for (j = 0; j < size; j++){
        round = 0.0;
        h = 0.1;
        for (let k = 0; k < subarray[i][j]; k++){
          if (subarray[i][j] == 1){
            network.body.data.edges.add([{id: counter, from: i, to: j, arrows: 'to', smooth: {type: 'curvedCW', roundness: 0.0}, title:''+nodes.get(i).label+'-'+nodes.get(j).label}]);
            counter++;
          }
          else{
            network.body.data.edges.add([{id: counter, from: i, to: j, arrows: 'to', smooth: {type: 'curvedCW', roundness: round}, title:''+nodes.get(i).label+'-'+nodes.get(j).label+'('+(k+1)+')'}]);
            counter++; 
            if (k % 2 == 0){
              round = round + h;
            }
            else{
              round = round - h;
            }
            h = h + 0.1; 
          } 
        }
      }
    }
  }
  else if(dir_undir_graph_btn.innerHTML == 'Undirected graph' && load_unload_graph_btn.innerHTML == 'Loaded graph' ){
      for (i = 0; i < size; i++){
       for (j = 0; j < size; j++){
        if (i <= j){
          if (subarray[i][j]!=0){
            network.body.data.edges.add([{id: counter, from: i, to: j, smooth: {type: 'curvedCW', roundness: 0.0}, label: subarray[i][j], title:''+nodes.get(i).label+'-'+nodes.get(j).label}]);
            counter++;
          }
        }
      }
    }
  }
  else if(dir_undir_graph_btn.innerHTML == 'Directed graph' && load_unload_graph_btn.innerHTML == 'Loaded graph'){
    for(i = 0; i < size;i++){
      for(j = 0; j < size; j++){
        round = 0.0;
        if (subarray[i][j] != 0){
          if (subarray[j][i] != 0) round = 0.1;
          network.body.data.edges.add([{id: counter, from: i, to: j, smooth: {type: 'curvedCW', roundness: round}, arrows: 'to', label: subarray[i][j], title:''+nodes.get(i).label+'-'+nodes.get(j).label}]);
          counter++;
        }     
      }
    }
  }  
}

function isNumeric(n){   
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function to_double_array(){
  two_matrix = [];
  for (let i = 0; i < matrix_items_array.length; i++){
    two_matrix[i] = matrix_items_array[i].value;
  }
  for (let i = 0; i < Math.sqrt(two_matrix.length); i++){
    subarray[i] = two_matrix.slice((i * Math.sqrt(two_matrix.length)), (i * Math.sqrt(two_matrix.length)) + Math.sqrt(two_matrix.length));    
  }
  size = Math.sqrt(two_matrix.length);
}

let undo_button = document.getElementById("undo");
let redo_button = document.getElementById("redo");
let array_of_conditions_sizes = [];
let array_of_conditions_labels = [[],[],[],[],[],[],[],[],[],[]];
let array_of_conditions_adj_matr = [[],[],[],[],[],[],[],[],[],[]];
let array_of_nodesLabels = [];
let count = 0;
let max_count = 0;
function saving(){
  if (count < 10){ 
    array_of_conditions_sizes[count] = size;
    array_of_conditions_adj_matr[count] = subarray.slice();
    array_of_conditions_labels[count] = array_of_nodesLabels.slice();
    count++;
  }
  else{
    for(let i = 0; i <= 8; i++){
      array_of_conditions_adj_matr.splice(i, 1, array_of_conditions_adj_matr.slice(i + 1, i + 2));
      array_of_conditions_sizes[i] = array_of_conditions_sizes[i + 1];
      array_of_conditions_labels[i] = array_of_conditions_labels[i + 1];
    }
    array_of_conditions_adj_matr[9] = subarray.slice();
    array_of_conditions_sizes[9] = size;
    array_of_conditions_labels[9] = array_of_nodesLabels.slice();
  }
  max_count = count;
}

function undo_func(){
  size = matrix_size[selected_tab].value;
  prev_size = size;
  if (size.length != 0) count--;
  subarray = [];
  delete_edges();
  delete_nodes();
  if (count == 0){
    alert("You have reached the maximum point of return");
    count++;
  }
  if (count < 10){
    matrix_size.value = array_of_conditions_sizes.slice(count - 1, count);
    size = array_of_conditions_sizes.slice(count - 1, count);
    subarray = array_of_conditions_adj_matr.slice(count - 1, count);
    array_of_nodesLabels = array_of_conditions_labels.slice(count - 1, count);
    matrix_size[selected_tab].value = size;
    let buf_arr_AM = [];    
    let buf_arr_L = [];
    for (let i = 0; i < size; i++)
      buf_arr_L[i] = array_of_nodesLabels[0][i];
    array_of_nodesLabels = buf_arr_L;
    for (let i = 0; i < size; i++){
      buf_arr_AM[i] = [];
      for (let j = 0; j < size; j++)
        buf_arr_AM[i][j] = 0;
    }
    full = 0;
    for(let i = 0; i < size; i++){
      if (i == 1) break;
      for(let j = 0; j < size; j++){
        for(let k = 0; k < size; k++){
          if (!isNumeric(subarray[i][j].slice(k, k + 1))){
            full++;
            break;
          }
          if (full == 0) buf_arr_AM[j][k] = subarray[i][j].slice(k, k + 1);
        }
        if (full > 0) break;
      }
      if (full > 0) break;
    }
    if (full > 0){
      for(let z = 0; z < size; z++){
        if(z == 1) break;
        for(let i = 0; i < size; i++){
          if (i == 1) break;
          for(let j = 0; j < size; j++){
            for(let k = 0; k < size; k++){  
              buf_arr_AM[j][k] = subarray[z][i][j].slice(k, k + 1);
            }
          }
        } 
      }
    }
    subarray = buf_arr_AM;
    flag_newNodes = 0;
    draw_nodes();     
    create_adj_matrix();
    for (i = 0; i < size; i++){
      for (j = 0; j < size; j++){
        matrix_items_array[i * size + j].value = subarray[i][j]; 
        matrix_items_array[i * size + j].addEventListener("keyup", keyup_event);
      }
    }
    draw_edges(); 
    create_inc_matrix();
  }
  full = 0; 
  sizeble();
}

function redo_func(){
  if (size.length != 0) count++;
  subarray = [];  
  if (count > max_count){
    alert("You have reached the maximum point of return");
    count--;
  }
  if (count <= max_count){ 
    delete_edges();
    delete_nodes();
    matrix_size[selected_tab].value = array_of_conditions_sizes.slice(count - 1, count);
    size = array_of_conditions_sizes.slice(count - 1, count);
    subarray = array_of_conditions_adj_matr.slice(count - 1, count);
    array_of_nodesLabels = array_of_conditions_labels.slice(count - 1, count);
    let buf_arr_AM = [];    
    let buf_arr_L = [];
    for (let i = 0; i < size; i++)
      buf_arr_L[i] = array_of_nodesLabels[0][i];
    array_of_nodesLabels = buf_arr_L;
    for (let i = 0; i < size; i++){
      buf_arr_AM[i] = [];
      for (var j = 0; j < size; j++)
        buf_arr_AM[i][j] = 0;
    }
    for(let i = 0; i < size;i++){
      if (i == 1) break;
      for(let j = 0; j < size; j++){
        for(let k = 0; k < size; k++)
          buf_arr_AM[j][k] = subarray[i][j].slice(k, k + 1);
      }
    } 
    subarray = buf_arr_AM;
    flag_newNodes = 0;
    draw_nodes();
    create_adj_matrix();
    for (i = 0; i < size; i++){
      for (j = 0; j < size; j++){
        matrix_items_array[i * size + j].value = subarray[i][j]; 
        matrix_items_array[i * size + j].addEventListener("keyup", keyup_event);
      }
    }
    draw_edges();     
    create_inc_matrix();  
  }
  sizeble();
}

let nd = 0;
let delete_node_id = document.getElementById('delete_node');
delete_node_id.onclick = function (){
  to_double_array();
  nd = network.getSelectedNodes();
  if (nd == '') alert("The top is not selected")
  else{
    delete_edges();
    delete_nodes();
    matrix_size[selected_tab].value--;
    size = matrix_size[selected_tab].value;
    let buf_arr = [];
    for (let i = 0; i < size; i++){
      buf_arr[i] = [];
      for (var j = 0; j < size; j++)
        buf_arr[i][j] = 0;    
    }
    for (let i = 0; i <= size; i++){
      for (let j = 0; j <= size; j++){
        if((i < nd) && (j < nd)) buf_arr[i][j] = subarray[i][j];
        if((i < nd) && (j > nd)) buf_arr[i][j - 1] = subarray[i][j];
        if((i > nd) && (j < nd)) buf_arr[i - 1][j] = subarray[i][j];
        if((i > nd) && (j > nd)) buf_arr[i - 1][j - 1] = subarray[i][j];
      }
    }   
    subarray = buf_arr;
    flag_newNodes = 0;
    for (let i = 0; i < size; i++)
      if (i >= nd) array_of_nodesLabels[i] = array_of_nodesLabels[i + 1];     
    array_of_nodesLabels.splice(size, 1);
    draw_nodes();
    create_adj_matrix();
    for (i = 0; i < size; i++){
      for (j = 0; j < size; j++){
        matrix_items_array[i * size + j].value = subarray[i][j]; 
        matrix_items_array[i * size + j].addEventListener("keyup", keyup_event);
      }
    }
    draw_edges();
    create_inc_matrix();
    saving();
  }  
}

let label_node = '';
let inp_new_label = document.getElementById("new_node_label");
let confirm_name = document.getElementById("confirm_name");
confirm_name.onclick = function(event){ 
  array_of_nodesLabels[size] = inp_new_label.value;
  to_double_array(); 
  let buf_arr = [];
  for (let i = 0; i <= size; i++){
    buf_arr[i] = [];
    for (var j = 0; j <= size; j++){
      if ((i != size) && (j != size)) buf_arr[i][j] = subarray[i][j];
      else buf_arr[i][j] = 0;
    }
  }
  subarray = buf_arr;
  delete_edges();
  delete_nodes();  
  matrix_size[selected_tab].value++;
  size = matrix_size[selected_tab].value;
  prev_size = size;
  flag_newNodes = 0;
  draw_nodes(); 
  create_adj_matrix();
  for (i = 0; i < size; i++){
    for (j = 0; j < size; j++){
      matrix_items_array[i * size + j].value = subarray[i][j]; 
      matrix_items_array[i * size + j].addEventListener("keyup", keyup_event);
    }
  }
  draw_edges();
  create_inc_matrix();
  saving();
}

let changed_label_node = '';
let confirm_changed_name = document.getElementById("confirm_changed_name");
let ch_lb_node = document.getElementById("changed_node_label");
confirm_changed_name.onclick = function(event){
  let nd = network.getSelectedNodes();
  if (nd == '') alert("The top is not selected");
  else{
    delete_edges();
    delete_nodes();
    array_of_nodesLabels[nd] = ch_lb_node.value;
    to_double_array();
    flag_newNodes = 0;
    draw_nodes();
    create_adj_matrix();
    for (i = 0; i < size; i++){
      for (j = 0; j < size; j++){
        matrix_items_array[i * size + j].value = subarray[i][j]; 
        matrix_items_array[i * size + j].addEventListener("keyup", keyup_event);
      }
    }
    draw_edges();
    create_inc_matrix();
    saving();
  }
}

let loop_id = document.getElementById('loop_label');
loop_id.onclick = function (){
  let nd = network.getSelectedNodes();
  if (nd == '') alert("The top is not selected");
  else{
    delete_edges();
    to_double_array();
    subarray[nd][nd] = +(subarray[nd][nd]) + 1;
    draw_edges();
    create_inc_matrix();
    saving();
  }
}
 
let load_unload_graph_btn = document.getElementById('load_unload_graph'); 
let dir_undir_graph_btn = document.getElementById('dir_undir_graph'); 
let unload_graph_btn = document.getElementById('unl_graph'); 
let load_graph_btn = document.getElementById('load_graph'); 
let undir_graph_btn = document.getElementById('undir_graph'); 
let dir_graph_btn = document.getElementById('dir_graph'); 

function load_to_unl_parse(){ 
  load_unload_graph_btn.innerHTML = unload_graph_btn.innerHTML; 
} 
function unload_to_load_parse(){ 
  load_unload_graph_btn.innerHTML = load_graph_btn.innerHTML; 
}
function dir_to_undir_parse(){ 
  dir_undir_graph_btn.innerHTML = undir_graph_btn.innerHTML; 
}
function undir_to_dir_parse(){ 
  dir_undir_graph_btn.innerHTML = dir_graph_btn.innerHTML; 
}

let x_mas = [];
let y_mas = [];
let name_mas = [];
let file_vert_flag = false;
document.getElementById('file').addEventListener('change', FileSelect);
let test_arr = '';
function FileSelect(input){
  var reader = new FileReader();
  var fileToRead = document.querySelector('input').files[0];
  reader.addEventListener("loadend", function(){
  from_file_flag = true;
  if(reader.result[0] == 'V'){
    file_vert_flag = true;
    test_arr = reader.result.replace(/^.{7}/, '');
    test_arr = test_arr.replace(/.{1}$/, '');
    i = 0;
    let name_x_y = 0;
    let name = "";
    let x = '';
    y = '';
    minus = 0;
    c = 0;
    while(i < test_arr.length){
      k = i;
      if (test_arr[i] == "(") {
        name_x_y = 1;
        k = i + 1;
      }
      if (test_arr[i] == ",") {
        x = parseFloat(x);
        if (minus == 1){
          x = (-1) * x;
          x = (-1) * x;
        }
        minus = 0;
        name_x_y = 2;
        k = i + 1;
      }
      if (test_arr[i]==";"){
        minus = 0;
        k = i + 1;
      }
      if (test_arr[i] == ")"){
        y = parseFloat(y);
        if (minus == 1){
          y = (-1) * y;
          y = (-1) * y;
        } 
        x_mas[c] = x;
        y_mas[c] = y;
        name_mas[c] = name;
        name_x_y = 0;
        x = '';
        y = '';
        name = "";
        c++;
        k = i + 1;
      }
      if ((name_x_y == 0) && (k == i)) name = name + test_arr[i]; 
      if ((name_x_y == 1) && (k == i)){
        if(test_arr[i] == "-") minus = 1;
        x = x + test_arr[i];
      }
      if ((name_x_y == 2) && (k == i)){
        if(test_arr[i] == "-") minus = 1;
        y = y + test_arr[i];
      }
      i++;
    }
    matrix_size[selected_tab].value = c;
    add_matrix();
  }
  else{
    test_arr = reader.result.split(/[ \n]/);
    let tmp_size = Math.sqrt(test_arr.length);
    symmetric = true;
    zero_one = true;
    let file_matrix = [];
    for (let i = 0; i < tmp_size; i++){
      file_matrix[i] = [];
      for (let j = 0; j < tmp_size; j++){
        file_matrix[i][j] = 0;
        k = 0;
        while(isNumeric(test_arr[i * tmp_size + j][k])){
          file_matrix[i][j] = file_matrix[i][j] * 10 + test_arr[i * tmp_size + j][k];
          k++;                      
        }
      }
    }    
    for(let i = 0; i < tmp_size; i++){
      for(let j = 0; j < tmp_size; j++){   
        if(file_matrix[i][j] != file_matrix[j][i]){
          symmetric = false;
          break;
        }
      }
    }
    for (let i = 0; i < tmp_size; i++){
      for (let j = 0; j < tmp_size; j++){
       if (file_matrix[i][j] != '00' && file_matrix[i][j] != '01'){
         zero_one = false;
         break;
       }
      }
    } 
    if (!(tmp_size % 1 == 0))
      alert ('The entered matrix does not have size n*n');
    else{
      if (dir_undir_graph_btn.innerHTML == 'Undirected graph' && load_unload_graph_btn.innerHTML == 'Unloaded graph' ){
        if (symmetric == false || zero_one == false)
          alert('The matrix is asymmetric or does not consist of 0 and 1');
        else{
          matrix_size[selected_tab].value = tmp_size;
          add_matrix();    
        }
      }
      else if (dir_undir_graph_btn.innerHTML == 'Directed graph' && load_unload_graph_btn.innerHTML == 'Unloaded graph' ){
        if (zero_one == false)
          alert('The matrix does not consist of 0 and 1');
        else{
          matrix_size[selected_tab].value = tmp_size;
          add_matrix(); 
        }
      }
      else if(dir_undir_graph_btn.innerHTML == 'Undirected graph' && load_unload_graph_btn.innerHTML == 'Loaded graph' ){
        if(symmetric == false){
          alert('The matrix is asymmetric');
        }
        else{
          matrix_size[selected_tab].value = tmp_size;
          add_matrix(); 
        }        
      }
      else{
        matrix_size[selected_tab].value = tmp_size;
        add_matrix();
        }
      }
    }
  });
  reader.readAsText(fileToRead);
}

document.getElementById('save_as_adj_matrix').addEventListener('click', download_file_adj);
function download_file_adj(filename, type){
  let data = '';
  for (let i = 0; i < matrix_items_array.length; i++){
    if ((i != 0) && (i % matrix_size[selected_tab].value == 0)){
      data = data + '\n';
    }
    if ((i + 1) % size == 0){
      data = data + matrix_items_array[i].value;
    } else data = data + matrix_items_array[i].value + ' ';
  }
  let file = new Blob([data], {type: type});
  let a = document.createElement("a")
  let url = URL.createObjectURL(file);
  a.href = url;
  let my_file_name = prompt('Enter file name');
  if (my_file_name != null){
    a.download = my_file_name + ".txt";
    document.body.appendChild(a);
    a.click();
  }
  setTimeout(function() {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);  
  }, 0); 
}

document.getElementById('save_as_inc_matrix').addEventListener('click', download_file_inc);
function download_file_inc(filename, type){
  size = matrix_size[selected_tab].value;
  let data = '  |';
  let empty_elems = $('.empty');
  let edges_elems = $('.cols_td');
  let point_elems = $('.rows');
  let content_td_elms = $('.content_td_inc');
  let k = 0;

  for (let i = 0; i < counter; i++){
    data = data + edges_elems[i].innerHTML + '|';
  }
  for (let j = 0; j < content_td_elms.length; j++){
    if (j % counter == 0){
      data = data + '\n' + point_elems[k].innerHTML + ' | ';
      k++;
    }
    data = data + content_td_elms[j].innerHTML + ' | ';
  }
  let file = new Blob([data], {type: type});
  let a = document.createElement("a")
  let url = URL.createObjectURL(file);
  a.href = url;
  let my_file_name = prompt('Enter file name');
  if (my_file_name != null){
    a.download = my_file_name + ".txt";
    document.body.appendChild(a);
    a.click();
  }
  setTimeout(function(){
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);  
  }, 0); 
}

document.getElementById('save_as_picture').addEventListener('click', save_picture);
function save_picture(){
  html2canvas(document.getElementById('field')).then(function(canvas) {
    var my_screen = canvas;
    var dataURL = my_screen.toDataURL("image/jpeg");
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.href = dataURL;
    let my_file_name = prompt('Enter picture name');
    if (my_file_name != null){
      link.download = my_file_name + ".jpg";
      link.click();
    }
    document.body.removeChild(link);
  });
}

document.getElementById('save_as_vertices').addEventListener('click', save_vertices); 
function save_vertices(filename, type){ 
  let data = "Vertex{";
  size = matrix_size[selected_tab].value;
  for (let i = 0; i < size; i++){
    if (i != (size -1 )){
     data = data + nodes.get(i).label + "(" + nodes.get(i).x.toFixed(2) + "," + nodes.get(i).y.toFixed(2)+");";
    }
    else{
     data = data + nodes.get(i).label + "(" + nodes.get(i).x.toFixed(2) + "," + nodes.get(i).y.toFixed(2)+")"; 
    }
  }
  data = data +"}";
  let file = new Blob([data], {type: type}); 
  let a = document.createElement("a") 
  let url = URL.createObjectURL(file); 
  a.href = url; 
  let my_file_name = prompt('Enter file name'); 
  if (my_file_name != null){
    a.download = my_file_name + ".txt"; 
    document.body.appendChild(a); 
    a.click();
  } 
  setTimeout(function() { 
    document.body.removeChild(a); 
    window.URL.revokeObjectURL(url); 
  }, 0); 
}

document.getElementById('lab04').addEventListener('click', lab04);
function lab04(filename, type){
  double_arr = [];
  for (let i = 0; i < size; i++){
    double_arr[i] = [];
  }
  for (let k = 0; k < size; k++){
    for (let j = 0; j < size; j++){
      double_arr[k][j] = matrix_items_array[k*size + j].value;
    }
  }
  weightsOfNodes = [];
  let sum = 0;
  if ((dir_undir_graph_btn.innerHTML == 'Undirected graph' && load_unload_graph_btn.innerHTML == 'Unloaded graph') ||
      (dir_undir_graph_btn.innerHTML == 'Undirected graph' && load_unload_graph_btn.innerHTML == 'Loaded graph') ){
    for (i = 0; i < size; i++){
      sum = 0;
      for (j = 0; j < size; j++){
        if (i != j) sum += 1 * double_arr[i][j];
        else sum += 2 * double_arr[i][j]; 
      }
      weightsOfNodes[i] = sum;
    }
  }
  else if((dir_undir_graph_btn.innerHTML == 'Directed graph' && load_unload_graph_btn.innerHTML == 'Unloaded graph') ||
          (dir_undir_graph_btn.innerHTML == 'Directed graph' && load_unload_graph_btn.innerHTML == 'Loaded graph')){
    for (i = 0; i < size; i++){
      sum = 0;
      for (j = 0; j < size; j++){
        if (i != j) sum += 1 * double_arr[i][j] + 1 * double_arr[j][i];
        else sum += 2 * double_arr[i][j]; 
      }
      weightsOfNodes[i] = sum;
    }
  }
  let data = "Weights of nodes(name of the node: weight):" + '\n';
  for (i = 0; i < size; i++){
    data = data + nodes.get(i).label + " : " + weightsOfNodes[i] + '\n';
  } 

  let double_arr_copy = double_arr;
  for(i = 0; i < size; i++){
    for (j = 0; j < size; j++){
      if (i == j) double_arr_copy[i][j] = 0;
    }
  }

  for (i = 0; i < size; i++) double_arr_copy[i][i]=0;
  
  for (let k = 0; k < size; k++) {
    for (let j = 0; j < size; j++) {
      for (let i = 0; i < size; i++) {
        if((i != j) && double_arr_copy[i][k] > 0 && double_arr_copy[k][j] > 0)
          if (1 * double_arr_copy[i][j] > 1 * double_arr_copy[i][k] + 1 * double_arr_copy[k][j] || double_arr_copy[i][j] == 0)
            double_arr_copy[i][j] = 1 * double_arr_copy[i][k] + 1 * double_arr_copy[k][j];
      }
    }
  }
  let rad = double_arr_copy[0][0];
  let diam = double_arr_copy[0][0];   
  for(i = 0; i < size; i++){
    rad = double_arr_copy[i][0];
    diam = double_arr_copy[i][0];
    for (j = 0; j < size; j++){
      if (i != j){
        if (double_arr_copy[i][j] < rad) rad = double_arr_copy[i][j];
        if (double_arr_copy[i][j] > diam) diam = double_arr_copy[i][j];
      }
    }
  } 
  data = data + "Radius: " + rad + '\n' + "Diameter: " + diam + '\n'; 
  double_arr = [];
  for (let i = 0; i < size; i++){
    double_arr[i] = [];
  }

  for (let k = 0; k < size; k++){
    for (let j = 0; j < size; j++){
      double_arr[k][j] = matrix_items_array[k*size + j].value;
    }
  }
  powersOfNodes = [];
  if ((dir_undir_graph_btn.innerHTML == 'Undirected graph' && load_unload_graph_btn.innerHTML == 'Unloaded graph') ||
      (dir_undir_graph_btn.innerHTML == 'Undirected graph' && load_unload_graph_btn.innerHTML == 'Loaded graph') ){
    for (i = 0; i < size; i++){
      sum = 0;
      for(j = 0; j < size; j++){
        if (i != j) if (double_arr[i][j] != 0) sum += 1;
        else if (double_arr[i][j] != 0) sum += 2; 
      }
      powersOfNodes[i] = sum;
    }
  }
  else if((dir_undir_graph_btn.innerHTML == 'Directed graph' && load_unload_graph_btn.innerHTML == 'Unloaded graph') ||
        (dir_undir_graph_btn.innerHTML == 'Directed graph' && load_unload_graph_btn.innerHTML == 'Loaded graph')){
    for (i = 0; i < size; i++){
      sum = 0;
      for (j = 0; j < size; j++){
        if (i != j){
          if (double_arr[i][j] != 0) sum += 1;
          if (double_arr[j][i] != 0) sum += 1;
        }
        else {
          if (double_arr[i][j] != 0)
          sum += 2; 
        }
      }
      powersOfNodes[i] = sum;
    }
  }
  data = data + "Powers of nodes(name of the node: power):" + '\n';
  for (i = 0; i < size; i++){
    data = data + nodes.get(i).label + " : " + powersOfNodes[i] + '\n';
  } 
  alert(data);
  let file = new Blob([data], {type: type}); 
  let a = document.createElement("a") 
  let url = URL.createObjectURL(file); 
  a.href = url; 
  if (confirm('Do you want to save data to a file?')){
    let my_file_name = prompt('Enter file name'); 
    if (my_file_name != null){
      a.download = my_file_name + ".txt"; 
      document.body.appendChild(a); 
      a.click(); 
    }
    setTimeout(function() { 
      document.body.removeChild(a); 
      window.URL.revokeObjectURL(url); 
    }, 0);
  }
}

document.getElementById('add__for_graph').addEventListener('click', Addition_graph);
function Addition_graph(){
  size = matrix_size[selected_tab].value;
  for (let i = 0; i < size; i++) nodes.update({id: i, color: {background: "white"}});
  let tmp_count = 0;
  let double_arr = []; 
  for (let i = 0; i < size; i++){ 
    double_arr[i] = []; 
  } 
  for (let k = 0; k < size; k++){ 
    for (let j = 0; j < size; j++){ 
      double_arr[k][j] = +matrix_items_array[k * size + j].value;
    } 
  }

  for (let i = 0; i < size; i++){
    for (let j = 0; j < size; j++){
      if (double_arr[i][j] != 0){
        tmp_count++;
      } else if ((i == j) && (double_arr[i][j] == 0)){
        tmp_count++;
      }
    }
  }

  if (tmp_count == size * size){
    alert('Сomplete graph');
  } else {
    delete_edges();
    for (let k = 0; k < matrix_items_array.length; k++){
      if (matrix_items_array[k].value == 1) matrix_items_array[k].value = 0;
      else matrix_items_array[k].value = 1;
    }
    for (let i = 0; i < size; i++){
      for (let j = 0; j < size; j++){
        if ((i == j) && (double_arr[i][j] == 0)){
          matrix_items_array[i * size + j].value = 0;
        }
      }
    }
    full_subarray();
    draw_edges();
  }
  create_inc_matrix();
}

document.getElementById('lab14').addEventListener('click', lab14);
function lab14(filename, type){
  let double_arr = [];
  for (let i = 0; i < size; i++){
    double_arr[i] = [];
  }

  for (let k = 0; k < size; k++){
    for (let j = 0; j < size; j++){
       double_arr[k][j] = matrix_items_array[k * size + j].value;
    }
  }
  
  let color_arr = ["#63b598", "#ce7d78", "#ea9e70", "#a48a9e", "#c6e1e8", "#648177" ,"#0d5ac1" ,
                  "#f205e6" ,"#1c0365" ,"#14a9ad" ,"#4ca2f9" ,"#a4e43f" ,"#d298e2" ,"#6119d0",
                  "#d2737d" ,"#c0a43c" ,"#f2510e" ,"#651be6" ,"#79806e" ,"#61da5e" ,"#cd2f00" ,
                  "#9348af" ,"#01ac53" ,"#c5a4fb" ,"#996635","#b11573" ,"#4bb473" ,"#75d89e" ,
                  "#2f3f94" ,"#2f7b99" ,"#da967d" ,"#34891f" ,"#b0d87b" ,"#ca4751" ,"#7e50a8" ,
                  "#c4d647" ,"#e0eeb8" ,"#11dec1" ,"#289812" ,"#566ca0" ,"#ffdbe1" ,"#2f1179" ,
                  "#935b6d" ,"#916988" ,"#513d98" ,"#aead3a", "#9e6d71", "#4b5bdc", "#0cd36d",
                  "#250662", "#cb5bea", "#228916", "#ac3e1b", "#df514a", "#539397", "#880977",
                  "#f697c1"];
  let nodes_colors = [];
  nodes.update({id: 0, color: {background: color_arr[0]}});
  nodes_colors[0] = color_arr[0];
  let curr_colors = [];
  let color_finded = false;
  let k = 0;
  let chrom_numb = 1;

  for (let i = 1; i < size; i++){
    for (let j = 0; j < i; j++){
      if (double_arr[i][j] == 1){
        curr_colors[k] = nodes_colors[j];
        k++;
      }
    }
    if (curr_colors.length == 0){
      nodes.update({id: i, color: {background: color_arr[0]}});
      nodes_colors[i] = color_arr[0];
    }
    for (let m = 0; m < color_arr.length; m++){
      if (curr_colors.indexOf(color_arr[m]) == -1){
        nodes.update({id: i, color: {background: color_arr[m]}});
        nodes_colors[i] = color_arr[m];
        if ((m + 1) > chrom_numb){
          chrom_numb = m + 1;
        }
        break;
      }
    }
    k = 0;
    curr_colors = [];
  }
  alert(chrom_numb);
}

document.getElementById('connectivity_graph').addEventListener('click', con_graph);
function con_graph(){
  let flag_con = false;
  size = matrix_size[selected_tab].value;
  full_subarray();
  let m = [];
  for (let i = 0; i < size; i++){
    m[i] = [];
  }
  for (let i = 0; i < size; i++){
    for (let j = 0; j < size; j++){
      m[i][j] = subarray[i][j];
    }
  }
  let E = [];
  for (let i = 0; i < size; i++){ 
    E[i] = []; 
  } 
  for (let i = 0; i < size; i++){
    for (let j = 0; j < size; j++){
      if (i == j) E[i][j] = 1;
      else E[i][j] = 0;
    }
  }
  if (dir_undir_graph_btn.innerHTML == 'Directed graph'){
    for (let i = 0; i < size; i++){
      for (let j = 0; j < size; j++){
        if (subarray[i][j] == 1) subarray[j][i] = 1;
      }
    }
  }
  let power = 1;
  let A_res = subarray;

  for (let k = 0; k < size; k++){
    for (let i = 0; i < size; i++){
      for (let j = 0; j < size; j++){
        E[i][j] = E[i][j] || A_res[i][j]; 
      }
    }
    A_res = matrix_pow(power, A_res);
    if (power != size - 1) power++; 
  } 
  for (let i = 0; i < size; i++){
    for (let j = 0; j < size; j++){
      if (E[i][j] == 0){
        flag_con = false;
        break;
      }
      else flag_con = true;
    }
  }  
  let weakly = false;
  let strongly = false;
  if (dir_undir_graph_btn.innerHTML == 'Directed graph'){
    let str_bool = false;
    let col_bool = false;
    if (flag_con){
      for (let i = 0; i < size; i++){
        for (let j = 0; j < size; j++){
          if (m[i][j] == 1) str_bool = true;
          if (m[j][i] == 1) col_bool = true;
        } 
        if ((str_bool == false) || (col_bool == false)){
          alert('Weakly connected graph');
          weakly = true;
          break;
        }
        str_bool = false;
        col_bool = false;
      }
      if (weakly == false){
        alert('Strongly connected graph');
        strongly = true;
      }
    }
  } 
  let bool = [];
  let count_connect = 0;
  for (let i = 0; i < size; i++){
    if (!bool[i]){
      count_connect++;
      bool[i] = true;
      for (let j = 0; j < size; j++)
        if ((subarray[i][j]) && (!bool[j])) bool[j] = true;
    }
  }
  alert(count_connect);
  if ((flag_con) && (weakly == false) && (strongly == false)) alert('Connected graph');
  else if ((weakly == false) && (strongly == false)) alert('An incoherent graph');  
}

function multMatrix(A, B){ 
  size = matrix_size[selected_tab].value;  
  let rowsA = size;
  let rowsB = size;
  let colsB = size;
  let C = [];
  for (let i = 0; i < rowsA; i++)
    C[i] = new Array(colsB); 

  for (let k = 0; k < colsB; k++){ 
    for (let i = 0; i < rowsA; i++){ 
      let temp = 0;
      for (let j = 0; j < rowsB; j++){ 
        temp = temp || A[i][j] && B[j][k]; 
      }
      C[i][k] = temp;
    }
  } 
  return C;
}

function matrix_pow(n,A){  
  if (n == 1) return A;
  else return multMatrix(A, matrix_pow(n - 1, A));
}

function full_subarray(){
  size = matrix_size[selected_tab].value;
  for (let i = 0; i < size; i++) subarray[i] = []; 
  for (let k = 0; k < size; k++){ 
    for (let j = 0; j < size; j++){ 
      subarray[k][j] = +matrix_items_array[k * size + j].value;
    } 
  }
}