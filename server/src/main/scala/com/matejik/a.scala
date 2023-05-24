////package com.matejik;
////
////import akka.actor.ActorSystem
////import akka.http.scaladsl.Http
////import akka.http.scaladsl.model._
////import akka.http.scaladsl.model.headers.Accept
////import akka.http.scaladsl.unmarshalling.Unmarshal
////import akka.stream.ActorMaterializer
////import akka.util.ByteString
////import io.circe.parser._
////import io.circe.generic.auto._
////import io.circe.generic.semiauto.deriveEncoder
////import io.circe.syntax._
////import io.circe.{Encoder, Json}
////
////import scala.collection.mutable
////import scala.concurrent.duration.DurationInt
////import scala.concurrent.{Await, Future}
////import scala.io.StdIn
////
////object SPARQLServer {
////  def main(args: Array[String]): Unit = {
////    implicit val system = ActorSystem("sparql-server")
////    implicit val materializer = ActorMaterializer()
////    implicit val executionContext = system.dispatcher
////
//////    val query =
//////      """
//////        |PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
//////        |PREFIX dbo: <http://dbpedia.org/ontology/>
//////        |PREFIX dbp: <http://dbpedia.org/property/>
//////        |
//////        |SELECT DISTINCT ?p ?property ?value ?a ?b
//////        |WHERE {
//////        |    ?p ?property ?value.
//////        |    ?value ?a ?b.
//////        |    FILTER ( ?p =  <http://dbpedia.org/resource/Milos_Zeman>  || ?p =  <http://dbpedia.org/resource/Vaclav_Klaus>)
//////        |    FILTER(regex(str(?b), "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"))
//////        |}
//////        |
//////        |""".stripMargin
////    val query = """
////                  |PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
////                  |PREFIX dbo: <http://dbpedia.org/ontology/>
////                  |PREFIX dbp: <http://dbpedia.org/property/>
////                  |
////                  |SELECT DISTINCT ?p ?value
////                  |WHERE {
////                  |    {
////                  |    ?p <http://dbpedia.org/ontology/wikiPageWikiLink> ?value.
////                  |    FILTER ( ?value =  <http://dbpedia.org/resource/1._FC_Slovácko>)
////                  |} UNION {
////                  |  ?p <http://dbpedia.org/ontology/wikiPageWikiLink> ?value.
////                  |    FILTER ( ?p =  <http://dbpedia.org/resource/1._FC_Slovácko>)
////                  |} UNION {
////                  |     ?a <http://dbpedia.org/ontology/wikiPageWikiLink> ?p.
////                  |     ?value <http://dbpedia.org/ontology/wikiPageWikiLink> ?p.
////                  |    FILTER ( ?a =  <http://dbpedia.org/resource/1._FC_Slovácko>)
////                  |} UNION {
////                  |     ?a <http://dbpedia.org/ontology/wikiPageWikiLink> ?p.
////                  |     ?p <http://dbpedia.org/ontology/wikiPageWikiLink> ?value.
////                  |    FILTER ( ?a =  <http://dbpedia.org/resource/1._FC_Slovácko>)
////                  |}
////                  |}
////                  |""".stripMargin
////
////    val endpointUrl = "https://dbpedia.org/sparql"
////    val params = Map(
////      "query" -> query
////    )
////
////    val queryParams = params.map { case (key, value) => s"$key=${java.net.URLEncoder.encode(value, "UTF-8")}" }
////    val queryString = queryParams.mkString("&")
////    val uri = Uri(endpointUrl).withQuery(Uri.Query(queryString))
////
////    val request = HttpRequest(
////      method = HttpMethods.GET,
////      uri = uri,
////      headers = List(Accept(MediaTypes.`application/json`))
////    )
////
////    val responseFuture: Future[HttpResponse] = Http().singleRequest(request)
////    val responseAsString = Await.result(
////      responseFuture.flatMap(resp => Unmarshal(resp.entity).to[String]),
////      10000.millis
////    )
//    import collection.mutable
//    val res = new mutable.HashMap[String, mutable.Set[String]] with mutable.MultiMap[String, String]
//
//    //    var res: mutable.HashMap[String, String] = new mutable.HashMap()
//    val result = parse(responseAsString).flatMap(_.as[Root])
//    result match {
//      case Right(root) => root.results.bindings.foreach((x) => (res.addBinding(x.p.value, x.value.value)));
//      case Left(error) => println(s"Failed to parse JSON: $error")
//    }
////
////
//    val aa = res.filter(_._2.size > 10)
//
//    res.foreach {
//      case (key, value) => println(key + " -> " + value)
//    }
////
////
////    // Convert the map to JSON
////    val json: Json = res.asJson
////
////    // Print the JSON
////    println(json)
////
////    //    assert(responseAsString == "Hello, world!")
////    //    responseFuture
////    //      .flatMap {
////    //        case HttpResponse(StatusCodes.OK, _, entity, _) =>
////    //          entity.dataBytes
////    //            .runFold(ByteString(""))(_ ++ _)
////    //            .map(_.utf8String)
////    //        case _ =>
////    //          Future.successful("Error executing SPARQL query")
////    //      }
////    //      .foreach { result =>
////    //        println(result)
////    //        system.terminate()
////    //      }
////
////    StdIn.readLine()
////  }
////}
