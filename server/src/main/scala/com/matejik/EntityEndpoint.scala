package com.matejik

import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import org.apache.jena.query.{ResultSetFormatter}
import org.apache.jena.sparql.engine.http.QueryEngineHTTP

import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

object EntityEndpoint {
  val route: Route =
    path("entity" / Segment) { entityID =>
      get {
        val query =
          s"""
             |PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
             |PREFIX dbo: <http://dbpedia.org/ontology/>
             |PREFIX dbp: <http://dbpedia.org/property/>
             |
             |SELECT DISTINCT ?property ?value
             |WHERE {
             |  {
             |    <http://dbpedia.org/resource/Charles_IV,_Holy_Roman_Emperor> dbo:wikiPageWikiLink ?value.
             |    ?value dbo:wikiPageWikiLink ?property.
             |  }
             |}""".stripMargin
        System.out.println(query)

        val queryExecution = new QueryEngineHTTP("http://dbpedia.org/sparql", query)

        onComplete(Future(queryExecution.execSelect())) {
          case scala.util.Success(resultSet) =>
            System.out.println(resultSet)
//            val resultString = if (resultSet.hasNext) {
//              resultSet.next().get("description").toString
//            } else {
//              s"No description found for entity with ID $entityID"
//            }
            val resultString = ""

            complete(resultString)

          case scala.util.Failure(ex) =>
            complete(s"An error occurred: ${ex.getMessage}")
        }
      }
    }
}
