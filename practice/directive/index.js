import Vue from 'vue'

new Vue({
  el: '#root',
  template: `
  <div>
    <div v-text="text"></div>
    <div v-html="html"></div>
    <div v-show="active"></div>
    <ul>
      <li v-for="(item,index) in arr">{{item}}：{{index}}</li>
    </ul>
    <ul>
      <li v-for="(val,key,index) in obj">{{val}}：{{key}}：{{index}}</li>
    </ul>
    <input type="checkbox" v-model="active"><br>
    <input type="checkbox" v-model="arr" :value="1"><br>
    <input type="checkbox" v-model="arr" :value="2"><br>
    <input type="checkbox" v-model="arr" :value="3"><br>
    <div v-pre>{{text}}</div>
    <div v-once>{{text}}</div>
  </div>
  `,
  data: {
    text: 0,
    active: false,
    html: '<span>hello</span>',
    arr: [2, 3],
    obj: { a: 1, b: 2, c: 3 }
  }
})
