const D = '/' // Type:Label Delimiter

export type DeepArray<T> = Array<DeepArray<DeepArray<T>> | DeepArray<T> | T>;

export interface Occurrence {
  label : string,
  unique : number,
  data : { value : string, count : number }[]
}

export interface LooseObject {
  [key: string]: any
}

function JSONentries(obj : Object) : DeepArray<any> {
  if(Array.isArray(obj)) {
    return obj.map(o => { return JSONentries(o) });
  } else if(typeof obj == 'object') {
    let entries : string [] | any[] = Object.entries(obj).map(entry => { 
      return entry[1] instanceof Object ? [ entry[0], JSONentries(entry[1]) ] : [ entry[0], entry[1] ] });
    return entries;
  } else {
    return obj;
  }
}

function isEntry(entry : DeepArray<any>) {
  if(entry.length == 2 && !Array.isArray(entry[0]) && !Array.isArray(entry[1])) return true;
  else return false;
}

function flatEntries(entries : DeepArray<any> | any, key? : string) : Array<any> {
  if(isEntry(entries)) return [(key ? key + D : '') + entries[0], entries[1]];

  let flat : Array<any> = [];
  let k = entries[0];
  let v = entries[1];
  
  // definitely an array value
  if(Array.isArray(entries)) {
    if(Array.isArray(k)) {
      entries.forEach(entry => { flat.push(flatEntries(entry, key)); });
    }  
    else {
      // not so definitely a key value
      if(typeof k == 'string' && typeof v == 'string') {
        console.warn('Key and Value are both strings: [' + k + D + v + ']');
      }
      if(entries.length != 2) flat = [key, entries]
      else if(Array.isArray(v)) flatEntries(v, (key ? key + D : '') + k).map(entry => flat.push(entry));
      else flat = [(key ? key + D + k : k), v];
    }
  }
  // console.log('flat:', flat);
  return flat;
}

function levelEntries(entries : DeepArray<any>) : Array<any> {
  var level : Array<any> = [];
  if(Array.isArray(entries)) {
    if(entries.length == 2 && !Array.isArray(entries)) {
      level.push(entries);
    } else {
      for(let entry of entries) {
        if(Array.isArray(entry)) {
          if(entry.length == 2 && !Array.isArray(entry[0])) {
            level.push(entry);
          } else levelEntries(entry).map(e => { level.push(e); });
        }
      }
    }
  }
  return level;
}

export function flatJSONentries(obj : Object) : Array<any> {
  let entries : DeepArray<any> = JSONentries(obj);
  let flat = flatEntries(entries);
  // console.log('flat:', flat);
  return levelEntries(flat);
}

export function logArray(array : any[]) : string {
  let log : string = '';
  array.map((a, i) => {
    if(Array.isArray(a)) log += ( i == 0 ? '[ ': ', [ ' ) + logArray(a) + ' ]';
    else log += ( i == 0 ? Object(a).toString() : ', ' + Object(a).toString() ); 
  });
  return log;
}

export function JSONtoCSVlist(obj : any) : DeepArray<any> {
  
  let flat : any[] = flatJSONentries(obj);
  let flats : any[] = [];
  // console.log('flat:', flat);
  let l : number = -1;
  for(let i = 0; i < flat.length; i++) {
    // console.log('flat' + i + ':', flat[i])
    if(l >= 0 && flat[i][0] == flat[l][0]) {
      if(l == i - 1) {
        let f = [];
        for(let j = 0; j < flat.length; j++) {
          if(flat[j][0] != flat[l][0] || l == j) {
            f.push(flat[j]);
          }
        }
        flats.push(f);        
      }
      let f = [];
      for(let j = 0; j < flat.length; j++) {
        if(flat[j][0] != flat[l][0] || i == j) {
          f.push(flat[j]);
        }
      }
      flats.push(f);
    } else l = i;
  }
  
  // console.log('before fs:', flats);
  let fs = [];
  let labels : string[] = [];
  for(let flat of flats) {
    let csv : string[] = [];
    for(let entry of flat){
      if(!(contains(labels, entry[0]))) labels.push(entry[0]);
      csv.push(entry[1]);
    }
    fs.push(csv);
  }
  // console.log('after fs:', [labels, fs]);
  return [labels, fs];
}

function sameObjects(left : any, right : any) : boolean {
  if(!(left && right)) { return false };
  if(Array.isArray(left)) {
    if(Array.isArray(right)) {
      return sameArrays(left, right);
    }
  }
  else if(typeof left == 'object') {
    if(typeof right == 'object') {
      const lkeys = Object.keys(left);
      const rkeys = Object.keys(right);
      if (lkeys.length !== rkeys.length) return false;
      for (let key of lkeys) if (left[key] !== right[key]) return false;
      return true;
    }
  }
  else return left == right;
  return false;
}

function sameArrays(left : any[], right : any[]) {
  // console.log('same arrays');
  // compare lengths - can save a lot of time 
  if(left.length != right.length) return false;

  for(let i = 0, l = left.length; i < l; i++) {
    if(Array.isArray(left[i]) && Array.isArray(right[i])) return left[i].toString() == right[i].toString();
  }
  return false;
}

export function same(left : any, right : any) : boolean {
  if(Array.isArray(left) && Array.isArray(right)) return sameArrays(left, right);
  else return sameObjects(left, right);
}

export function objectContains(obj : any, o : any) : boolean {
  if(!(typeof obj == 'object' || obj == o)) return false;

  let keys = Object.keys(obj);
  for(let key of keys) {
    if(Array.isArray(obj[key])) obj[key]!.map((o : any, k : number) => { return objectContains(obj[key][k], o) })
    else if(obj[key]) {
      if(same(obj[key], o)) return true;
      else return objectContains(obj[key], o);
    }
  }
  return false;
}

export function arrayContains(array : any[], obj : any) : boolean {
  if(Array.isArray(array)) {
    // console.log('here');
    if(array.length == 0) return false;
    for(let a of array) {
      if(Array.isArray(obj)) {
        let found = false;
        if(sameArrays(a, obj)) { return true; }
      }
      else if(arrayContains(a, obj)) { return true; }
    }
  } else if(array && obj) { return sameObjects(array, obj) };
  return false;
}

export function contains(obj : any, o : any) : boolean {
  if(Array.isArray(obj)) return arrayContains(obj, o);
  else return objectContains(obj, o);
}

export function has(obj : any, o : any) : boolean {
  if(typeof obj == 'object') {
    let keys = Object.keys(obj)
    for(let key of keys) {
      if(contains(obj[key], o)) return true;
      else if(has(obj[key], o)) return true;
    }
  }
  else if(contains(obj, o)) return true;
  return false;
}

export function indexOf(array : any[], obj : any) : number {
  if(array.length == 0) return -1;
  for(let i = 0; i < array.length; i++) {
    if(Array.isArray(obj) && sameArrays(array[i], obj)) return i;
    else if(typeof array[i] == 'object' && typeof obj == 'object' && sameObjects(array[i], obj)) return i;
    else if(array[i] == obj) return i;
  }
  return -1;
}

export function JSONstoCSVlist(objs : any[]) : string[][][] {
  let csv : string[][][] = [];
  if(Array.isArray(objs)) {
    let csvs : string [][][] = [];
    for(let obj of objs) csvs.push(JSONtoCSVlist(obj));
    let labels : string[][] = [];
    for(let c of csvs) {
      if(!arrayContains(labels, c[0])) {
        labels.push(c[0]);
        csv.push([]);
      }
      csv[indexOf(labels, c[0])].push(c[1]);
    }
    csv.push(labels)
    return csv;
  } else return JSONstoCSVlist([objs]);
}

export function JSONstoCSVs(objs : any[]) : string[] {
  if(!Array.isArray(objs)) objs = [objs];
  let csvlist = JSONstoCSVlist(objs);
  let labels = csvlist.pop();
  let csvs : string[] = [];
  if(labels) for(let i = 0; i < labels.length; i++) {
    let csv = labels[i].toString() + '\n';
    for(let line of csvlist[i]) {
      for(let data of line) csv += data.toString() + '\n';
      }
    csvs.push(csv);
  };
  
  return csvs;
}