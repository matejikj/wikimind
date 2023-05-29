package com.matejik

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model._
import akka.http.scaladsl.model.headers.Accept
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.stream.ActorMaterializer
import akka.util.ByteString
import io.circe.parser._
import io.circe.generic.auto._
import io.circe.generic.semiauto.deriveEncoder
import io.circe.syntax._
import io.circe.{Encoder, Json}

import scala.concurrent.duration.DurationInt
import scala.concurrent.{Await, ExecutionContextExecutor, Future}
import scala.io.StdIn

object QueryEndpoint {
  def route(implicit system: ActorSystem, materializer: ActorMaterializer, executionContext: ExecutionContextExecutor): Route =
    path("query") {
      get {
        parameters(Symbol("q").as[String]) { aa =>
          val sparqlQuery =
            s"""
               |PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
               |PREFIX dbo: <http://dbpedia.org/ontology/>
               |PREFIX dbp: <http://dbpedia.org/property/>
               |
               |SELECT DISTINCT ?p ?value
               |WHERE {
               |    {
               |    ?p <http://dbpedia.org/ontology/wikiPageWikiLink> ?value.
               |    FILTER ( ?value = <http://dbpedia.org/resource/$aa>)
               |} UNION {
               |  ?p <http://dbpedia.org/ontology/wikiPageWikiLink> ?value.
               |    FILTER ( ?p = <http://dbpedia.org/resource/$aa>)
               |} UNION {
               |     ?a <http://dbpedia.org/ontology/wikiPageWikiLink> ?p.
               |     ?value <http://dbpedia.org/ontology/wikiPageWikiLink> ?p.
               |    FILTER ( ?a = <http://dbpedia.org/resource/$aa>)
               |} UNION {
               |     ?a <http://dbpedia.org/ontology/wikiPageWikiLink> ?p.
               |     ?p <http://dbpedia.org/ontology/wikiPageWikiLink> ?value.
               |    FILTER ( ?a = <http://dbpedia.org/resource/$aa>)
               |}
               |}
               |""".stripMargin

          println(sparqlQuery)
          val endpointUrl = "https://dbpedia.org/sparql"
          val params = Map(
            "query" -> sparqlQuery
          )

          val queryParams = params.map { case (key, value) => s"$key=${java.net.URLEncoder.encode(value, "UTF-8")}" }
          val queryString = queryParams.mkString("&")
          val uri = Uri(endpointUrl).withQuery(Uri.Query(queryString))

          val request = HttpRequest(
            method = HttpMethods.GET,
            uri = uri,
            headers = List(Accept(MediaTypes.`application/json`))
          )

          onComplete(Http().singleRequest(request)) {
            case scala.util.Success(response) =>
              val responseAsString = Await.result(
                response.entity.toStrict(10000.millis).map(_.data.utf8String),
                10000.millis
              )
              import collection.mutable
              val res = new mutable.HashMap[String, mutable.Set[String]] with mutable.MultiMap[String, String]

              //    var res: mutable.HashMap[String, String] = new mutable.HashMap()
              val result = parse(responseAsString).flatMap(_.as[Root])
//              result match {
//                case Right(root) => root.results.bindings.foreach((x) => (res.addBinding(x.p.value, x.value.value)));
//                case Left(error) => println(s"Failed to parse JSON: $error")
//              }
//              //
//              //
//              val aa = res.filter(_._2.size > 10)
//
//              aa.foreach {
//                case (key, value) => println(key + " -> " + value)
//              }

              complete(result.toString)

            case scala.util.Failure(ex) =>
              complete(s"An error occurred: ${ex.getMessage}")
          }
        }
      }
    }
}



//    val query =
//      """
//        |PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
//        |PREFIX dbo: <http://dbpedia.org/ontology/>
//        |PREFIX dbp: <http://dbpedia.org/property/>
//        |
//        |SELECT DISTINCT ?p ?property ?value ?a ?b
//        |WHERE {
//        |    ?p ?property ?value.
//        |    ?value ?a ?b.
//        |    FILTER ( ?p =  <http://dbpedia.org/resource/Milos_Zeman>  || ?p =  <http://dbpedia.org/resource/Vaclav_Klaus>)
//        |    FILTER(regex(str(?b), "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"))
//        |}
//        |
//        |""".stripMargin


//PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
//PREFIX dbo: <http://dbpedia.org/ontology/>
//PREFIX dbp: <http://dbpedia.org/property/>
//
//SELECT ?value (COUNT(?value) AS ?count)
//WHERE {
//  {
//    ?a <http://dbpedia.org/ontology/wikiPageWikiLink> ?p.
//      ?value <http://dbpedia.org/ontology/wikiPageWikiLink> ?p.
//      FILTER ( ?a = <http://dbpedia.org/resource/Bílovice>)
//  } UNION {
//    ?a <http://dbpedia.org/ontology/wikiPageWikiLink> ?p.
//      ?p <http://dbpedia.org/ontology/wikiPageWikiLink> ?value.
//      FILTER ( ?a = <http://dbpedia.org/resource/Bílovice>)
//  }}
//GROUP BY ?value