class sort {
  static selectionSort(ary){
    let min = null;
    for(let i = 0; i < ary.length - 1; i++){
      min = i;
      for(let j = i + 1; j < ary.length; j++){
        if(ary[min] > ary[j]){
          [ ary[min], ary[j] ] = [ ary[j], ary[min] ];
        }
      }
    }
    return ary;
  } 
  static bubbleSort(ary){
    for(let i = 0; i < ary.length - 1; i++){
      for(let j = 0; j < ary.length - i - 1; j++){
        if(ary[j] > ary[j + 1]){
          [ ary[j], ary[j + 1] ] = [ ary[j + 1], ary[j] ];
        }
      }
    }
    return ary;
  }
  static insertionSort(ary){
    for(let i = 1; i < ary.length; i++){
      let min = ary[i];
      let j = i - 1;
      while( j >= 0 && ary[j] > min){
        ary[j + 1] = ary[j];
        j = j - 1;
      }
      ary[j + 1] = min;
    }
    return ary;
  }
  static mergeSort(arr){
    let len = arr.length;
    if(len > 1) {
      let index = Math.floor(len / 2);
      let left = arr.slice(0,index); 
      let right = arr.slice(index); 
      return this.merge(this.mergeSort(left) , this.mergeSort(right)); 
    }else {
      return arr;
    }
  }
  static merge(left , right){
    let arr = [];
    while(left.length && right.length) {
      if(left[0] < right[0]) {
        arr.push(left.shift());
      }else {
        arr.push(right.shift())
      }
    }
    return arr.concat(left , right);
  }
  static heapSort(arr){
    let len = arr.length;
    for(let i = Math.floor( len / 2); i >= 0; i--){
      this.heapify(arr, i, len);
    }
    for(let j = 0; j < len; j++){
      [ arr[0], arr[ len - 1 - j] ] = [ arr[ len - 1 - j], arr[0] ]
      this.heapify(arr, 0, len - 2 - j);
    }
    return arr;
  }
  static heapify(arr, i, size){
    let l = 2 * i + 1;
    let r = 2 * i + 2;
    let large = i;
    if(l <= size && arr[l] > arr[large]){
      large = l;
    }
    if(r <= size && arr[r] > arr[large]){
      large = r;
    }
    if(large !== i){
      [arr[i], arr[large] ] = [arr[large], arr[i]];
      this.heapify(arr, large, size);
    }
  }
  static quickSort(arr, low, high){
    if(low < high){
      let pi = this.partition(arr, low, high);
      this.quickSort(arr, low, pi - 1);
      this.quickSort(arr, pi + 1, high);
    }
    return arr;
  }
  static partition(arr, low, high){
    let pivot = arr[high];
    let index = low - 1;
    for(let j = low; j <= high - 1; j++){
      if(arr[j] <= pivot){
        index++;
        [ arr[index], arr[j] ] = [ arr[j], arr[index] ];
      }
    }
    [ arr[index + 1], arr[high] ] = [ arr[high], arr[index+1] ];
    return index + 1
  }
  static shellSort(arr){
    let len =arr.length;
    let gap = Math.floor(len/2);
    while(gap!==0){
      for(let i = gap;i<len;i++){
        let temp = arr[i];
        let j;
        for(j=i-gap;j>=0&&temp<arr[j];j-=gap){
          arr[j+gap] = arr[j];
        }
        arr[j+gap] = temp;
      }
      gap=Math.floor(gap/2);
    }
  return arr;
  }
  static radixSort(arr){
    let max = Math.max.apply(null, arr);
    let times = this.getLoopTime(max);
    let bucket = Array.from({length: 10},()=>{ return []; })
    for(let radix = 1; radix <= times; radix++){
      this.lsdRadixSort(arr, bucket, arr.length, radix);
    }
    return arr;
  }
  static getLoopTime(num){
    let digits = 0;
    while(num > 1){
      digits++;
      num = num / 10;
    }
    return digits;
  }
  static lsdRadixSort(arr, buckets, len, radix){
    for(let i = 0; i < len; i++){
      let el = arr[i];
      let index = Math.floor((el / Math.pow(10, radix)) % 10);
      buckets[index].push(el);
      console.log(buckets);
    }
    let k = 0;
    for(let i = 0; i < 10; i++){
      let bucket = buckets[i];
      for(let j = 0; j < bucket.length; j++){
        arr[k++] = bucket[j];
      }
      bucket.length = 0;
    }
  }
}

let ary = [170, 45, 75, 90, 802, 2, 24, 66];
//console.log(sort.selectionSort(ary));
//console.log(sort.bubbleSort(ary));
console.log(sort.radixSort(ary, 0, ary.length - 1));