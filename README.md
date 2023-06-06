# diplomka




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

//PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
//PREFIX dbo: <http://dbpedia.org/ontology/>
//PREFIX dbp: <http://dbpedia.org/property/>
//
//SELECT ?p (COUNT(?value) AS ?count)
//WHERE {
//  {
//    ?a <http://dbpedia.org/ontology/wikiPageWikiLink> ?p.
//      ?value <http://dbpedia.org/ontology/wikiPageWikiLink> ?p.
//      FILTER ( ?a = <http://dbpedia.org/resource/Bílovice>)
//  } }
//GROUP BY ?p

