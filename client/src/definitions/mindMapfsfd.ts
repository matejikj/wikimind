import { SCHEMA_INRUPT, RDF } from "@inrupt/vocab-common-rdf";

export const mindMapDefinition = {
  "identity": {
    "vocabulary": RDF.type,
    "subject": "https://schema.org/Book"
  },
  "properties": {
    "id": {
      "vocabulary": SCHEMA_INRUPT.identifier,
    },
    "title": {
      "vocabulary": SCHEMA_INRUPT.text,
    },
    "url": {
      "vocabulary": SCHEMA_INRUPT.URL,
    },
    "acccessType": {
      "vocabulary": SCHEMA_INRUPT.accessCode,
    },
    "created": {
      "vocabulary": SCHEMA_INRUPT.dateModified,
    },
    "nodes": {
      "identity": {
        "vocabulary": RDF.type,
        "subject": "http://schema.org/TextDigitalDocument"
      },
      "properties": {
        "cx": {
          "vocabulary": "http://schema.org/distance"
        },
        "cy": {
          "vocabulary": "http://schema.org/email"
        },
        "description": {
          "vocabulary": "http://schema.org/brand"
        },
        "title": {
          "vocabulary": "http://schema.org/alternateName"
        },
        "id": {
          "vocabulary": "http://schema.org/productID"
        }
      }}
    ,
    "links": {
      "identity": {
        "vocabulary": RDF.type,
        "subject": "http://schema.org/TextDigitalDocument"
      },
      "properties": {
        "from": {
          "vocabulary": SCHEMA_INRUPT.email,
        },
        "to": {
          "vocabulary": SCHEMA_INRUPT.addressRegion,
        },
        "title": {
          "vocabulary": SCHEMA_INRUPT.alternateName,
        },
        "id": {
          "vocabulary": SCHEMA_INRUPT.attendee,
        }
      }
    }
  }
}