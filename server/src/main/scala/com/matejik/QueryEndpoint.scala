package com.matejik

import akka.actor.{Actor, ActorRef, ActorSystem, Props}
import akka.http.scaladsl.Http
import akka.http.scaladsl.model._
import akka.http.scaladsl.model.headers.Accept
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.pattern.ask
import akka.stream.ActorMaterializer
import akka.util.{ByteString, Timeout}
import io.circe.parser._
import io.circe.generic.auto._
import io.circe.generic.semiauto.deriveEncoder
import io.circe.syntax._
import io.circe.{Encoder, Json}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.RouteResult.Complete

import java.util
import scala.concurrent.duration.DurationInt
import scala.concurrent.{Await, ExecutionContextExecutor, Future}
import scala.io.StdIn
import scala.util.{Failure, Success}

case class Head(link: List[String], vars: List[String])
case class Binding(p: UriValue, value: UriValue)
case class Results(distinct: Boolean, ordered: Boolean, bindings: List[Binding])
case class UriValue(`type`: String, value: String)
case class Root(head: Head, results: Results)


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
               |    ?p <http://dbpedia.org/ontology/wikiPageWikiLink> ?value.
               |    FILTER ( ?p = <http://dbpedia.org/resource/$aa>)
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

          implicit val timeout: Timeout = Timeout(5.seconds)

          onComplete(Http().singleRequest(request)) {
            case scala.util.Success(response) =>
              val responseAsString = Await.result(
                response.entity.toStrict(10000.millis).map(_.data.utf8String),
                10000.millis
              )
              val result = parse(responseAsString).flatMap(_.as[Root])

              val results: List[String] = result match {
                case Right(root) =>
                  root.results.bindings.map { x =>
                    x.value.value
                  }
                case Left(error) =>
                  println(s"Failed to parse JSON: $error")
                  List.empty
              }

              val futureResults: Future[List[String]] = Future.traverse(results) { value =>

                val ff =
                  s"""
                     |PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                     |PREFIX dbo: <http://dbpedia.org/ontology/>
                     |PREFIX dbp: <http://dbpedia.org/property/>
                     |
                     |SELECT DISTINCT ?p ?value
                     |WHERE {
                     |    ?p <http://dbpedia.org/ontology/wikiPageWikiLink> ?value.
                     |    FILTER ( ?p = <$value>)
                     |}
                     |""".stripMargin

                println(value)
                val endpointUrl = "https://dbpedia.org/sparql"
                val bb = Map(
                  "query" -> ff
                )

                val cc = bb.map { case (key, value) => s"$key=${java.net.URLEncoder.encode(value, "UTF-8")}" }
                val dd = cc.mkString("&")
                val ee = Uri(endpointUrl).withQuery(Uri.Query(dd))

                val gg = HttpRequest(
                  method = HttpMethods.GET,
                  uri = ee,
                  headers = List(Accept(MediaTypes.`application/json`))
                )

                Http().singleRequest(gg)
                  .flatMap { response =>
                    val hh = Await.result(
                      response.entity.toStrict(10000.millis).map(_.data.utf8String),
                      10000.millis
                    )
                    val ii = parse(hh).flatMap(_.as[Root])
                    val jj: List[String] = ii match {
                      case Right(root) =>
                        root.results.bindings.map { x =>
                          x.value.value
                        }
                      case Left(error) =>
                        println(s"Failed to parse JSON: $error")
                        List.empty
                    }

                    Future(jj.toString())
                  }
              }

              val aggregatedResult: Future[List[String]] = futureResults.map(_.toList)

              onComplete(aggregatedResult) {
                case Success(resultsList) =>
                  println(resultsList)
                  complete(resultsList.toString())
                case Failure(ex) =>
                  complete(s"An error occurred: ${ex.getMessage}")
              }

            case scala.util.Failure(ex) =>
              complete(s"An error occurred: ${ex.getMessage}")
          }
        }
      }
    }
}

object Main {
  def main(args: Array[String]): Unit = {
    implicit val system = ActorSystem("dbpedia-akka-http")
    implicit val materializer = ActorMaterializer()
    implicit val executionContext = system.dispatcher

    val routes: Route = QueryEndpoint.route(system, materializer,executionContext)

    val bindingFuture = Http().newServerAt("localhost", 8080).bind(routes)

    println(s"Server online at http://localhost:8080/\nPress RETURN to stop...")
    StdIn.readLine()

    bindingFuture
      .flatMap(_.unbind())
      .onComplete(_ => system.terminate())
  }
}

