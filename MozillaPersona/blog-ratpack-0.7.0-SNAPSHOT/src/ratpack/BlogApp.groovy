import com.bleedingwolf.ratpack.*
import jwill.deckchair.*
import org.json.*
import org.apache.http.*
import org.apache.http.client.entity.UrlEncodedFormEntity
import org.apache.http.message.*
import org.apache.http.client.methods.*
import org.apache.http.util.*
import org.apache.http.impl.client.DefaultHttpClient

class BlogApp {
	public static void main(String []args) {
    def checkAuth = { session ->
      if (session == null)
        return false
      def data = session.getAttribute('data')
      def now = new Date().getTime()
      def expires = data.expires
      if (now <= expires)
        return true
      else {
        // session expired, invalidate it
        session.invalidate()
        return false
      }
    }

		def app = Ratpack.app {
				set 'public', 'public'
				set 'templateRoot', 'templates'

				def derby = new Deckchair([name:'posts',adaptor:'derby'])
        def httpclient = new DefaultHttpClient()

				get("/") {
					def list = derby.all()
          def session = request.getSession(false)
					render '/entry/index.html', [posts: list, authUser:session?.getAttribute("email")]
				}

        post('/login') {
          if (params.assertion == null)
            response.setStatus(400)

          def httpPost = new HttpPost("https://verifier.login.persona.org/verify")
          def nvps = new ArrayList<NameValuePair>()
          nvps.add new BasicNameValuePair("assertion", params.assertion)
          nvps.add new BasicNameValuePair("audience", "http://0.0.0.0:5000/")
          httpPost.setEntity(new UrlEncodedFormEntity(nvps))
          def postResponse = httpclient.execute(httpPost)

          // get response
          try {
            if (postResponse.getStatusLine().getStatusCode() == 200) {
                def entity2 = postResponse.getEntity()
                def verificationData = new JSONObject(entity2.getContent().getText())
                println verificationData
                // Check if assertion was valid
                if (verificationData.status.equals('okay')) {
                  def session = request.getSession(true)
                  session.setAttribute('email', verificationData.email)
                  session.setAttribute('data', verificationData)
                  return verificationData.email
                }
                EntityUtils.consume(entity2)
            }
          } finally {
            httpPost.releaseConnection()
          }
          ""
        }

        post('/logout') {
          def session = request.getSession(false)
          session?.invalidate()
          response.sendRedirect('http://0.0.0.0:5000')
        }

				get("/entry/list") {
					def list = derby.all()
					render '/entry/index.html', [posts: list]
				}

				post("/entry/save") {
					def entry = new Entry(params)
					derby.save(entry.properties, {obj ->
						println "Finished saving."
						new JSONObject([success:true]).toString()
					})
				}

				get("/entry/create") {
          // Check for valid credentials
          def session = request.getSession(false)
          if (checkAuth(session) == true) {
            render '/entry/create.html'
          } else return "You are not logged in or your auth has expired."
				}

				get("/entry/show/:id") {
					def entry = derby.get(urlparams.id)
					render '/entry/show.html', [entry: entry]
				}

		}
		AuthHelper.doAuth(app)
		RatpackServlet.serve(app)
	}
}
