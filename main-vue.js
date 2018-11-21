fakeData()

function Model(options){
  this.data = options.data
  this.resource = options.resource
}

Model.prototype.fetch = function(id){
  return axios.get(`/${this.resource}s/${id}`).then((response)=>{
    this.data = response.data
    return response
  })
}

Model.prototype.update = function(id,data){
  return axios.put(`/${this.resource}s/${id}`,data).then((response)=>{
    this.data = response.data
    return response
  })
}



var model = new Model({
  data: {
    name: '',
    number: 0,
    id: ''
  },
  resource: 'book'
})


var view = new Vue({
  el: '#app',
  data: {
    book:{
      name: '未命名',
      number: 0,
      id: ''
    }
  },
  template: `
    <div>
      <div>
        书名:《{{book.name}}》
        数量：<span id="number">{{book.number}}</span>
      </div>
      <div>
        <button v-on:click="addOne">加1</button>
        <button v-on:click="minusOne">减1</button>
        <button v-on:click="reset">归零</button>
      </div>
    </div>
  `,
  created(){
    model.fetch(1).then(()=>{
      this.book = model.data
    })
  },
  methods:{
    addOne(){
      model.update(1,{
        number: this.book.number-0+1
      }).then(()=>{
        this.book = model.data
      }) 
    },
    minusOne(){
      model.update(1,{
        number: this.book.number-0-1
      }).then(()=>{
        this.book = model.data
      })
    },
    reset(){
      model.update(1,{
      number: 0
      }).then(()=>{
        this.book = model.data
      }) 
    }
   }
})






function fakeData(){
  var book = {
  name: 'JavaScript高级程序设计',
  number: 2,
  id: 1
  }
  // 在真正返回 response 之前使用
  axios.interceptors.response.use(function(response){
    var config = response.config
    var {method,url,data} = config
    if( url === '/books/1' && method === 'get'){
      response.data = book
    }else if(url === '/books/1' && method === 'put'){
      data = JSON.parse(data)
      Object.assign(book,data)
      response.data = book
    }
    return response
  })
}