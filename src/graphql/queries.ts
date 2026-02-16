import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      role
    }
  }
`;

export const PING_QUERY = gql`
  query Ping {
    ping
  }
`;

export const AUTHORS_QUERY = gql`
  query Authors {
    authors {
      id
      firstName
      lastName
      birthDate
      biography
      nationality
      createdAt
      updatedAt
    }
  }
`;

export const CATEGORIES_QUERY = gql`
  query Categories {
    categories {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const PUBLISHERS_QUERY = gql`
  query Publishers {
    publishers {
      id
      name
      address
      city
      country
      website
      createdAt
      updatedAt
    }
  }
`;

export const BOOKS_QUERY = gql`
  query Books {
    books {
      id
      title
      isbn
      publicationDate
      price
      description
      pageCount
      language
      publisherId
      createdAt
      updatedAt
      publisher {
        id
        name
      }
      authors {
        id
        firstName
        lastName
      }
      categories {
        id
        name
      }
    }
  }
`;
