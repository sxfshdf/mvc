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


function View(options){
  this.el = options.el
  this.template = options.template
}

View.prototype.render = function(data){
  var html = this.template
  for(let key in data){
    html = html.replace(`__${key}__`,data[key])
  }
  $(this.el).html(html)
}

// 上面是 MVC 类，下面是对象

var model = new Model({
  data: {
    name: '',
    number: 0,
    id: ''
  },
  resource: 'book'
})


var view = new View({
  el: '#app',
  template: `
    <div>
      书名:《__name__》
      数量：<span id="number">__number__</span>
    </div>
    <div>
      <button id="addOne">加1</button>
      <button id="minusOne">减1</button>
      <button id="reset">归零</button>
    </div>
  `
})

var controller = {
  init(options){
    var view = options.view
    var model = options.model
    this.view = view
    this.model = model
    this.view.render(this.model.data)
    this.bindEvents()
    model.fetch(1).then(()=>{
      this.view.render(this.model.data)
    })
  },
  addOne(){
    var oldNumber = $('#number').text()
    var newNumber = oldNumber-0+1
    this.model.update(1,{
      number: newNumber
    }).then(()=>{
      this.view.render(this.model.data)
    }) 
  },
  minusOne(){
    var oldNumber = $('#number').text()
    var newNumber = oldNumber-0-1
    this.model.update(1,{
      number: newNumber
    }).then(()=>{
      this.view.render(this.model.data)
    })
  },
  reset(){
    this.model.update(1,{
    number: 0
    }).then(()=>{
      this.view.render(this.model.data)
    }) 
  },
  bindEvents(){
    $(this.view.el).on('click','#addOne',this.addOne.bind(this))
    $(this.view.el).on('click','#minusOne',this.minusOne.bind(this))
    $(this.view.el).on('click','#reset',this.reset.bind(this))
  }
}

controller.init({view:view,model:model})




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