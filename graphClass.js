'use strict'
function indexOfArr(arr1, fnd1) {
    var i, len1;

    //compare every element on the array
    for (i = 0, len1 = arr1.length; i < len1; i++) {

        //index missing, leave to prevent false-positives with 'undefined'
        if (!(i in arr1)) {
            continue;
        }

        //if they are exactly equal, return the index
        if (elementComparer(arr1[i], fnd1)) {
            return i;
        }
    }

    //no match found, return false
    return -1;
}
function elementComparer(fnd1, fnd2) {
    var i, len1, len2, type1, type2, iin1, iin2;

    //store the types of fnd1 and fnd2
    type1 = typeof fnd1;
    type2 = typeof fnd2;

    //unwanted results with '(NaN!==NaN)===true' so we exclude them
    if (!((type1 == "number" && type2 == "number") && (fnd1 + "" == "NaN" && fnd2 + "" == "NaN"))) {

        //unwanted results with '(typeof null==="object")===true' so we exclude them
        if (type1 == "object" && fnd1 + "" != "null") {
            len1 = fnd1.length;

            //unwanted results with '(typeof null==="object")===true' so we exclude them
            if (type2 == "object" && fnd2 + "" != "null") {
                len2 = fnd2.length;

                //if they aren't the same length, return false
                if (len1 !== len2) {
                    return false;
                }

                //compare every element on the array
                for (i = 0; i < len1; i++) {

                    iin1 = i in fnd1;
                    iin2 = i in fnd2;

                    //if either index is missing...
                    if (!(iin1 && iin2)) {

                        //they both are missing, leave to prevent false-positives with 'undefined'
                        if (iin1 == iin2) {
                            continue;
                        }

                        //NOT the same, return false
                        return false;
                    }

                    //if they are NOT the same, return false
                    if (!elementComparer(fnd1[i], fnd2[i])) {
                        return false;
                    }
                }
            } else {
                //NOT the same, return false
                return false;
            }
        } else {

            //if they are NOT the same, return false
            if (fnd1 !== fnd2) {
                return false;
            }
        }
    }

    //if it successfully avoided all 'return false', then they are equal
    return true;
}

class Graph{
	//конструктор 
	constructor(gr, orgOrNot = true){//1.клон или строка 2. ориентированный или нет
		this.graph = {};//создаем пустой граф
		this.orgGraph = orgOrNot;// создаем свойство отвечающее за ориентированный или нет
		if(gr && typeof gr === 'object'){
			this.graph = JSON.parse(JSON.stringify(gr.graph));
			this.orgGraph = gr.orgGraph;
		}else if(gr && typeof gr == 'string'){//если это строка из файла .json
			let res = JSON.parse(gr);// парсим в объект
			this.graph = res.graph;// записываем
			this.orgGraph = res.orgGraph;
		}
	}
	//добавление вершины
	setVertex(name){
		if(!this.graph[name]){//если такой вершины еще не существует
			this.graph[name] = {};//создаем ее
			this.graph[name].name = name;// дублируем имя в свойства дабы в будущем упростить себе поиск
			this.graph[name].target = [];//создаем свойство для хранения будущих ребер
		}else{
			console.log(`Вершина с таким именем ${name} уже существует`);// если вершина существует выплевываем ошибочку
		}
	}
	//получение вершины
	getVertex(name){
		if(this.graph[name]){
			return this.graph[name];
		}else{
			console.log(`Вершины ${name} не существует`);
		}
	}
	//удаление вершины
	removeVertex(name){
		if(this.graph[name]){//если искомая вершина существует
			for(let key in this.graph){//проходимся по всеми вершинам
				let item = this.graph[key];//запоминаем каждую
				for(let i = 0; i < item.target.length; i++){//бежим по свойству ребер
					if(item.target[i][0] == name){//если найдено ребро связанно с вершиной
						item.target.splice(i, 1);//удаляем его
					}
				}
			}
			delete this.graph[name];//удаляем вершину
		}else{
			console.log(`Вершины ${name} не существует`);
		}
	}
	//добавление ребра
	setEdge(parent, ArrayTarget){ // ArrayTarget = [targerName, ves]
		let k = 0
		let x = this.getVertex(parent);//a
		let y = this.getVertex(ArrayTarget[0]);//b
		if(x && y){
			x.target.forEach((index) =>{
				if(index[0] == ArrayTarget[0]){
					k++;
				}
			});
			if(k == 0){
				x.target.push(ArrayTarget);
				if(!this.orgGraph && y != x){	
					y.target.push([parent, ArrayTarget[1]]);
				}
			}else{
				console.log(`Ребро ${ArrayTarget} уже существует`);
			}
		}else if(!x){
			console.log(`Вершины ${parent} не существует`);
		}else{
			console.log(`Вершины ${ArrayTarget[0]} не существует`);
		}			
	}
	//ребра конкретной вершины
	getEdgesByVertax(parent){
		if(this.graph[parent]){
			var res = {};
			if(!this.orgGraph){
				res.edgesFrom = this.graph[parent].target;
			}else{
				res.edgesFrom = this.graph[parent].target;
				res.edgesIn = [];
				for(let key in this.graph){
					if(this.graph[key].name != parent){
						this.graph[key].target.forEach((item) =>{
							if(item[0] == parent){
								res.edgesIn.push([this.graph[key].name, item[1]]);
							}
						});
					}
				}
			}
			return res;
		}else{
			console.log(`Вершины ${name} не существует`);
		}
	}
	//удаление ребра
	removeEdge(parent, ArrayTarget){
		let x = this.graph[parent];//a
		let y = this.graph[ArrayTarget[0]];//b
		if(x && y){
			for(let i = 0; i < x.target.length; i++){
					if(x.target[i][0] == ArrayTarget[0]){
						x.target.splice(i, 1);
					} 
				}	
			if(!this.orgGraph){
				for(let i = 0; i < y.target.length; i++){
					if(y.target[i][0] == parent){
						y.target.splice(i, 1);
					} 
				}
			}
			
		}else if(!x){
			console.log(`Вершины ${parent} не существует`);
		}else{
			console.log(`Ребра ${ArrayTarget[0]} не существует`);
		}
	}
	//парсим весь граф в json
	getJson(){
		return JSON.stringify(this);
	}
	//список смежности в json
	getJsongr(){
		return JSON.stringify(this.graph);
	}
	//Степень конкретной вершины
	getVertexPow(name){
		if(this.graph[name]){
			let res = [];
			let edges = this.getEdgesByVertax(name);
			res.push(edges.edgesFrom.length);
			if(this.orgGraph){
				res.push(edges.edgesIn.length);
			}
			return res;
		}else{
			console.log(`Вершины ${name} не существует`);
		}	
	}
	//список ребер
	getEdgesList(){
		let res = [];
		for(let key in this.graph){
			let sub = [];
			let x = this.graph[key].target;
			x.forEach((item)=>{
				res.push([this.graph[key].name, ...item]); 
			})
		}
		return res;
	}
	//список смежностей
	getAdjList(){
		let x = this.graph;
		let res = [];

		for(let key in x){
			let item = {
				[x[key].name]:x[key].target
			}
			res.push(item);
		}
		return res;
	}
	//обход в ширину
	DFS(vertex){
		let edges = this.graph;//список вершин
		let s = new Array();//создали пустой массив
		let visited = new Array();//создали что-то вроде вектора, короче массив unique
		s.push(vertex);// запушили и туда
		visited.push(vertex);//и сюда точку старта
		while(s.length != 0){//пока массив s не пустой
			let t = s.pop();//достаем с конца элемент
			edges[t].target //бежим по смежностям вытащенного элемента
			//пропуская значения существующие в векторе
			.forEach(n => {
				if(visited.indexOf(n[0]) === -1){
					visited.push(n[0]);//добавляем вершину смежности в вектор
					s.push(n[0]);
				}
			});
		}
		return visited;
	}
	checkRout3(vertex, end, is){
		let edges = this.graph;//список вершин
		let s = new Array();//создали пустой массив
		let visited = new Array();//создали что-то вроде вектора, короче массив unique
		s.push(vertex);// запушили и туда
		visited.push(vertex);//и сюда точку старта
		while(s.length != 0){//пока массив s не пустой
			let t = s.pop();//достаем с конца элемент
			edges[t].target //бежим по смежностям вытащенного элемента
			//пропуская значения существующие в векторе
			.forEach(n => {
				if(visited.indexOf(n[0]) === -1 && is.indexOf(n[0]) === -1 ){
					let checkDfs = this.DFS(n[0]);
					if(checkDfs.indexOf(end) !== -1){
						visited.push(n[0]);//добавляем вершину смежности в вектор
						s.push(n[0]);		
					}
				}
			});
		}
		return visited;
	}
	//чекаем маршрут от v1 v2
	
	
	//Минимальный каркас Барувки
	getMinCorp(){
		let x = JSON.parse(JSON.stringify(this.graph));
		for(let key in x){
			let item = x[key].target;
			let min = 0
			for(let i = 0; i < item.length; i++){
				let subi = item[i][1];
				let next = item[i+1];
				if(next){
					if(subi > next[1]){
						min = next[1];
						item.splice(i, 1);
						i--;
					}else{
						min = subi;
						item.splice(i + 1, 1);
					}
				}
				
			}

		}
		return x;
	}
	//самый коротки маршрут Дикстра
	dijkstra(source, target){
		let edges = this.graph;
		const Q = new Set(),
			  prev = {},
			  dist = {},
			  adj = {};

		const vertex_with_min_dist = (Q, dist) =>{
			let min_distance = Infinity,
				u = null;

			for(let v of Q){
				if(dist[v] < min_distance){
					min_distance = dist[v];
					u = v;
				}
			}
			return u;
		}

		for(let key in edges){
			let item = edges[key];
			Q.add(item.name);
			dist[item.name] = Infinity;
			adj[item.name] = {};
			item.target.forEach(itemSu=>{
				adj[item.name][itemSu[0]] = itemSu[1];
			});
		}
	

		dist[source] = 0;

		while(Q.size){

			let u = vertex_with_min_dist(Q, dist);
			if(adj[u]){
				let neighbors = Object.keys(adj[u]).filter(v => Q.has(v));
				Q.delete(u);

				if(u === target) break;

				for(let v of neighbors){
					let alt = dist[u] + adj[u][v];
					if(alt < dist[v]){
						dist[v] = alt;
						prev[v] = u;
					}
				}
			}else{
				return 0;
			}

			
		}
		{
			let u = target,
				S = [u],
				len = 0;
			while (prev[u] !== undefined) {
	            S.unshift(prev[u])
	            len += adj[prev[u]][u]
	            u = prev[u]
	        }
	        return len;
		}
	}
	//Кратчайший маршрут FordBellman
	FordBellman(startVertex){
		let edges = {}
		for(let key in this.graph){
			let item = this.graph[key];
			edges[item.name] = item.target;
		}
		let dist = {};
		for(let key in edges){
			dist[key] = Infinity;
		}
		dist[startVertex] = 0;
		
		for(let iter in edges){
			for(let v in edges){
				for(let i = 0; i < edges[v].length; ++i){
					let item = edges[v][i];
					if(dist[item[0]] > dist[v] + item[1]){
						dist[item[0]] = dist[v] + item[1];
					}
				}
			}
		}
		return dist;
	}
	invertion(){

		let graph = new Graph(this).graph;
		let res = {
			graph:{},
			orgGraph:true
		};
		for(let key in graph){
			res.graph[key] = {
				name:key,
				target:[]
			}
		}
		for(let key2 in graph){
			let edges = graph[key2].target;
			edges.forEach(item=>{
				res.graph[item[0]].target.push([key2, item[1]])
			});
		}
		res.orgGraph = true;
		return new Graph(res);
	}
	
	DFStest(vertex, stock){
		let edges = this.graph;//список вершин
		let stack = new Array();
		let visited = new Array();
		let detected = new Array();
		stack.push(vertex);
		detected.push(vertex);
		let result = [];
		let pisya = [];
		while(stack.length != 0){
			let elem = stack.pop();
			let stocked = this.DFS(elem);
			if(visited.indexOf(elem) === -1 && stocked.indexOf(stock) !== -1){
				let bool = false;
				u:for(let i = 0; i < edges[elem].target.length; i++){
					let n = edges[elem].target[i];
					if(detected.indexOf(n[0]) === -1 && visited.indexOf(n[0]) === -1){
						stack.push(elem);
						stack.push(n[0]);
						detected.push(n[0]);
						bool = true;
						break u;
					}
				}
				if(!bool){
					visited.push(elem);
				}
			}
		}
		return [detected, pisya];
	}
	hard(){
		let invertation = this.invertion();
		let graph = this.graph;
		let order = [], component = [], used = [];
		let res = [];
		function dfs(v){
			used.push(v);
			graph[v].target.forEach(e=>{
				if(used.indexOf(e[0])===-1){
					
					dfs(e[0]);
				}
			})
			order.push(v);
			
		}
		function dfs2(v){
			used.push(v);
			component.push(v);
			invertation.graph[v].target.forEach(e=>{
				if(used.indexOf(e[0])===-1){
					dfs2(e[0]);
				}
			})
		}
		used = [];
		for(let key in this.graph){
			if(used.indexOf(key) === -1){
				dfs(key);
			}
		}
		used = [];
		for(let i = 0; i < order.length; ++i){
			let v = order[order.length - 1 - i];
			if(used.indexOf(v) === -1){
				dfs2(v);
				if(component.length > 1) res.push(component);
				component=[];
			}
		}
		return res;
	}
	maximal(){
		let gr = this.graph;

	}
}
var test1 = new Graph(null, true);
test1.setVertex('a');
test1.setVertex('b');
test1.setVertex('c');
test1.setVertex('d');
test1.setVertex('e');
test1.setVertex('i');
test1.setVertex('f');
test1.setVertex('g');
test1.setVertex('p');
test1.setVertex('l');
test1.setVertex('m');
test1.setVertex('z');
test1.setEdge('a', ['b', 10]);
test1.setEdge('b', ['c', 1]);
test1.setEdge('c', ['a', 3]);
test1.setEdge('a', ['d', 2]);
test1.setEdge('d', ['e', 5]);
test1.setEdge('e', ['i', 6]);
test1.setEdge('i', ['f', 7]);
test1.setEdge('f', ['g', 8]);
test1.setEdge('g', ['p', 9]);
test1.setEdge('p', ['l', 11]);
test1.setEdge('l', ['m', 17]);
test1.setEdge('m', ['p', 13]);
test1.setEdge('a', ['p', 40]);
test1.setEdge('a', ['i', 3]);
test1.setEdge('a', ['f', 156]);
console.log(test1.hard());

var testRout = new Graph(null, true);
testRout.setVertex('a');
testRout.setVertex('d');
testRout.setVertex('e');
testRout.setVertex('i');
testRout.setVertex('f');
testRout.setVertex('g');
testRout.setVertex('p');
testRout.setVertex('l');
testRout.setVertex('m');
testRout.setVertex('z');
testRout.setVertex('yo');
testRout.setVertex('lol');
testRout.setEdge('a', ['d', 2]);
testRout.setEdge('d', ['e', 5]);
testRout.setEdge('e', ['i', 6]);
testRout.setEdge('i', ['f', 7]);
testRout.setEdge('f', ['g', 8]);
testRout.setEdge('g', ['p', 9]);
testRout.setEdge('p', ['l', 11]);
testRout.setEdge('l', ['m', 17]);
testRout.setEdge('m', ['p', 13]);
testRout.setEdge('a', ['p', 40]);
testRout.setEdge('a', ['yo', 40]);
testRout.setEdge('yo', ['lol', 40]);
testRout.setEdge('lol', ['i', 40]);

testRout.setEdge('a', ['f', 156]);
console.log(testRout.checkRout3('a', 'i', ['d']));

var test2 = new Graph(test1.getJson());
test1.setVertex('yo');
test1.setVertex('lol');
test1.setEdge('a', ['yo', 60]);
test1.setEdge('a', ['lol', 90]);
var test3 = new Graph(null, false);
test3.setVertex('a');
test3.setVertex('b');
test3.setVertex('c');
test3.setVertex('d');
test3.setVertex('e');
test3.setVertex('i');
test3.setVertex('f');
test3.setVertex('g');
test3.setVertex('p');
test3.setVertex('l');
test3.setVertex('m');
test3.setVertex('z');
test3.setEdge('a', ['b', 10]);
test3.setEdge('b', ['c', 1]);
test3.setEdge('c', ['a', 3]);
test3.setEdge('a', ['d', 2]);
test3.setEdge('d', ['e', 5]);
test3.setEdge('e', ['i', 6]);
test3.setEdge('i', ['f', 7]);
test3.setEdge('f', ['g', 8]);
test3.setEdge('g', ['p', 9]);
test3.setEdge('p', ['l', 11]);
test3.setEdge('l', ['m', 17]);
test3.setEdge('m', ['p', 13]);

console.log(test1, test2, test3);

var test4 = new Graph(null, true);
test4.setVertex('a');
test4.setVertex('b');
test4.setVertex('c');
test4.setVertex('d');
test4.setVertex('e');
test4.setVertex('z');
test4.setVertex('y');
test4.setVertex('x');
test4.setEdge('a', ['b', 10]);
test4.setEdge('b', ['c', 1]);
test4.setEdge('c', ['a', 3]);
test4.setEdge('a', ['d', 2]);
test4.setEdge('d', ['e', 5]);
test4.setEdge('e', ['z', 9]);
test4.setEdge('z', ['y', 5]);
test4.setEdge('y', ['x', 15]);



const zeroPow = (gr) =>{
	let count = 0;
	let res = [];
	for(let key in gr.graph){
		count = 0;
		let item = gr.getVertexPow(gr.graph[key].name);

		item.forEach(index => {
			if(index != 0){
				count++;
			}
		})
		if(count == 0) res.push(gr.graph[key].name);
	}
	return res;
}
console.log(zeroPow(test1));
const intersection = (gr1, gr2) =>{
	let gRes = new Graph(gr1);
	for(let key in gRes.graph){
		let prop = gRes.graph[key];
		if(!gr2.graph.hasOwnProperty(prop.name)){
			gRes.removeVertex(key);
		}
		for(let i = 0; i < prop.target.length; i++){
			let vert1 = prop.target[i];
			if(indexOfArr(gr2.graph[key].target, vert1) === -1){
				gRes.removeEdge(key, vert1);
			}
		}
		
	}

	return gRes;
}
console.log(intersection(test1, test2));
const minWeight = (gr, P) =>{
	let graph = gr.graph;
	let stack = new Array();
	let res = [];
	for(let key in graph){
		let item = graph[key].name;
		stack.push(item);
	}
	while(stack.length > 0){
		let t = stack.shift();
		let sum = 0;
		for(let key in graph){
			let item = graph[key].name;
			let one = gr.dijkstra(t, item);
			sum += one;
		}
		if(sum <= P && sum != 0){
			res.push(t);
		}
	}
	return res;
}

console.log(minWeight(test1, 60));
const minWeight2 = (gr, u, v1, v2) =>{
	let chT = gr.FordBellman(u);
	let res = [];
	for(let key in chT){
		if(key == v1 || key == v2){
			res.push(chT[key]);
		}
	}
	return res;
}
console.log(minWeight2(test1, 'a', 'p', 'l'))
const minWeight3 = (gr) =>{
	let cht = gr.graph;
	let res = [];
	for(let key in cht){
		let o = gr.FordBellman(key);
		let sum = 0;
		for(let v in o){
			let item = o[v];
			if(item !== Infinity){
				sum+=item;
			}
		}
		if(sum != 0) res.push([key, sum]);
	}
	let min = ['start', Infinity];
	for(let i = 0; i < res.length; i++){
		let item = res[i];
		if(item[1] < min[1]){
			min = item;
		}
	}
	return min;
}
console.log(minWeight3(test3));
console.log(test3.getMinCorp());
let maximaizTest = new Graph();
maximaizTest.setVertex('a');
maximaizTest.setVertex('b');
maximaizTest.setVertex('c');
maximaizTest.setVertex('d');
maximaizTest.setVertex('e');
maximaizTest.setVertex('l');
maximaizTest.setVertex('t');
maximaizTest.setEdge('a', ['b', 40]);
maximaizTest.setEdge('a', ['c', 30]);
maximaizTest.setEdge('b', ['d', 70]);
maximaizTest.setEdge('c', ['d', 15]);
maximaizTest.setEdge('d', ['l', 20]);
maximaizTest.setEdge('d', ['e', 30]);
maximaizTest.setEdge('e', ['t', 25]);
maximaizTest.setEdge('l', ['t', 40]);
console.log(maximaizTest.DFStest('a', 't'));


