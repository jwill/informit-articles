import com.petebevin.markdown.*
import com.bleedingwolf.ratpack.*

class App {
	public static void main(String []args) {
		def app = Ratpack.app {
				set 'public', 'public'
				set 'templateRoot', 'templates'
				
				get("/") {
					def m = new MarkdownProcessor()
					def p = render 'template.md', [num:4]
					m.markdown(p)
				}

        // Retrieve post
        get("/:year/:month/:day/:title.html") {

        }
		}
		RatpackServlet.serve(app)
	}
}
