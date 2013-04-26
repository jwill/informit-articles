# Ratpack

## A Micro Web Framework for Groovy

Ratpack is inspired by the excellent [Sinatra](http://www.sinatrarb.com/) framework for Ruby, and aims to make Groovy web development more classy.


## Requirements

 * JDK 6
 * Nothing else! Ratpack is based on Groovy and Gradle, but the project template will download the correct version of each and cache them locally on your system.


## Getting Started

Ratpack is a pre-release framework, but it's mature enough to begin using if you're willing to accept the possibility of breaking changes in the future. Each version of Ratpack is deployed to Maven Central, so you'll always be able to use a released version, even if a future version forces you to have to change your code. (The Ratpack API is so simple that breaking changes are unlikely, but we never say never.)

The Ratpack project template gives you the project structure you need to get started. Clone this project or [download the current version](https://github.com/tlberglund/ratpack-template/zipball/master) to get a copy of the files on your system. (It might make more sense to download it, since your project won't maintain version continuity with the template project.)

The template gives you a file called `src/app/resources/scripts/app.groovy`, which looks like this:

```groovy
  get("/") {
    render('index.html')
  }
```

That instructs Ratpack to render the template `index.html` when the `/` URL is accessed. You can find the example template file in `src/app/resources/templates/index.html`. It looks like this:

```html
<!DOCTYPE html>
<html>
   <head>
      <title>Ratpack</title>
   </head>
   <body>
      <h1>Welcome to Ratpack</h1>
   </body>
</html>
```

You can run the project with the `jettyRunWar` target as follows:

```bash
$ gradlew jettyRunWar
```

### POST and Other Verbs

```groovy
  post("/submit") {
      // handle form submission here
  }

  put("/some-resource") {
      // create the resource
  }

  delete('/some-resource') {
      // delete the resource
  }

  register('propfind', '/some-resource') {
      // you can register your own verbs
  }

  register(['get', 'post'], '/formpage') {
      // you can register multiple verbs to the same handler
  }
```

### URL Parameters

You can capture parts of the URL to use in your handler code using the colon character. Any parameters that are captured are stored in the `urlparams` map.

```groovy
  get('/person/:personid') {
      "This is the page for person ${urlparams.personid}"
  }

  get("/company/:companyname/invoice/:invoiceid") {
      def company = CompanyDAO.getByName(urlparams.companyname)
      def invoice = company.getInvoice(urlparams.invoiceid)
      // you get the idea
  }
```

### GET and POST Parameters

Parameters in the query string or passed in via a `POST` request are available in the `params` map.

```groovy
  get("/search") {
    def results = SearchEngine.search(params.q)
    // etc.
  }
```

### Templates

Render templates using the `render` method. To specifiy where to load template files from, set the `templateRoot` setting. If the file isn't found in the template root, the renderer will try to load it as a resource from the classpath.

```groovy
  set 'templateRoot', 'myapp/templates'
  
  get("/") {
      render "homepage.html"
  }
```

Note that the default `templateRoot` is set to `src/app/resources/templates`. You will probably not have to override this.

You can also pass in a map to use in the template.

```groovy
  get('/page/:pagename') {
    render('page.html', [name: urlparams.pagename])
  }
```

The template syntax is the same as Groovy's [SimpleTemplateEngine](http://groovy.codehaus.org/Groovy+Templates).


### The Development Server

The default port is 5000, but you can specify another if you wish by adding the following to your app:

```groovy
  set 'port', 8080
```

You can also override it by adding the following configuration to your `build.gradle` file:

```groovy
jettyRunWar {
   httpPort = 8080
}
```
