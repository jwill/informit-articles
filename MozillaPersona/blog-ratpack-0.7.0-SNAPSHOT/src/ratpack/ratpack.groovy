
import org.ratpackframework.app.*
import org.ratpackframework.groovy.app.Routing
import org.ratpackframework.app.Request
import org.ratpackframework.app.Response
import org.apache.http.impl.client.*
(this as Routing).with {

  def derby = new jwill.deckchair.Deckchair([name:'posts', adaptor:'derby'])
  def httpclient = new DefaultHttpClient()

  get('/') { Request request, Response response ->
    def list = derby.all()
    //  response.cookie('email', 'e@j.com')
    response.render ([posts: list, authUser: request.getCookies().find{it.name == 'email'}?.getValue()], '/entry/index.html')
  }

  post('/login') {

  }

  post('/logout') {
    request.getSession().terminate()
    response.sendRedirect('http://0.0.0.0:5050')
  }

  get('/entry/list') { Request request, Response response ->
    def list = derby.all()
    response.render [posts:list], '/entry/index.html'
  }

  post('/entry/save') {
    def entry = new Entry(params)
    derby.save(entry.properties, {obj ->
      println "Finished saving."
      new JSONObject([success:true]).toString()
    })
  }

  get('/entry/create') {
  }

  get('/entry/show/:id'){
  }
}
