import org.json.*
import jwill.deckchair.*
import org.ratpackframework.app.*
import org.ratpackframework.groovy.app.Routing
import org.ratpackframework.app.Request
import org.ratpackframework.app.Response

(this as Routing).with {

	def derby = new Deckchair([name:'comments', adaptor:'derby'])

	get('/') {
   render('index.html')
	}

	post('/comment/:id') {

	}

}
