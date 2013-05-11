import org.json.*
import jwill.deckchair.*
import org.ratpackframework.app.*
import org.ratpackframework.groovy.app.Routing
import org.ratpackframework.app.Request
import org.ratpackframework.app.Response
import org.jboss.netty.handler.codec.http.multipart.HttpPostRequestDecoder

(this as Routing).with {

	def derby = new Deckchair([name:'comments', adaptor:'derby'])

	get('/') { Request request, Response response ->
    def list = derby.all()
    response.render([comments:list], 'index.html')
	}

	post('/comment') { Request request, Response response ->
	  def form = request.getForm()
    def comment = new Comment(form['authorName'][0], form['imageUrl'][0], form['commentText'][0])
    derby.save(comment.properties, { obj ->
      println "Finished saving."
      response.text obj.key
    })
  }

  get('/comments') { Request request, Response response ->
    def list = derby.all()
    response.text list
  }

  get('/nuke') {
    derby.nuke()
  }

}
