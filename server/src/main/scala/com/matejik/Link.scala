package com.matejik

case class Head(link: List[String], vars: List[String])
case class Binding(p: UriValue, value: UriValue)
case class Results(distinct: Boolean, ordered: Boolean, bindings: List[Binding])
case class UriValue(`type`: String, value: String)
case class Root(head: Head, results: Results)
